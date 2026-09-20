import type { IAuthProvider } from '@/features/auth/providers/auth-provider.interface';
import {
  AuthError,
  type AuthCredentials,
  type AuthResponse,
  type InstitutionalUserProfile,
} from '@/features/auth/types/auth.types';

type UatAuthPayload = {
  access_token?: unknown;
  accessToken?: unknown;
  refresh_token?: unknown;
  refreshToken?: unknown;
  user?: unknown;
};

type UatUserPayload = Record<string, unknown>;

export class UATAuthProvider implements IAuthProvider {
  private readonly baseUrl = process.env.EXPO_PUBLIC_UAT_API_URL;

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const payload = await this.request<UatAuthPayload>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    const accessToken = this.readString(payload, 'access_token', 'accessToken');

    if (!accessToken) {
      throw new AuthError('La respuesta UAT no contiene un access token.', 'INVALID_RESPONSE');
    }

    return {
      accessToken,
      refreshToken: this.readString(payload, 'refresh_token', 'refreshToken'),
      user: await this.getUserProfile(accessToken),
    };
  }

  async verifySession(token: string): Promise<boolean> {
    try {
      const response = await this.request<Response>('/auth/verify', {
        method: 'GET',
        token,
        rawResponse: true,
      });
      return response.ok;
    } catch (error) {
      if (error instanceof AuthError && error.code === 'TOKEN_EXPIRED') return false;
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const payload = await this.request<UatAuthPayload>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    const accessToken = this.readString(payload, 'access_token', 'accessToken');

    if (!accessToken) {
      throw new AuthError('La respuesta UAT no contiene un access token.', 'INVALID_RESPONSE');
    }

    return {
      accessToken,
      refreshToken: this.readString(payload, 'refresh_token', 'refreshToken') ?? refreshToken,
      user: await this.getUserProfile(accessToken),
    };
  }

  async getUserProfile(token: string): Promise<InstitutionalUserProfile> {
    const payload = await this.request<UatUserPayload>('/auth/me', {
      method: 'GET',
      token,
    });
    const user = this.asRecord(payload.user) ?? payload;

    return {
      id: this.requiredString(user, 'id', 'user_id'),
      studentId: this.requiredString(user, 'matricula', 'student_id', 'studentId'),
      fullName: this.requiredString(user, 'nombre', 'name', 'full_name', 'fullName'),
      institutionalEmail: this.requiredString(user, 'correo', 'email', 'institutional_email'),
      campus: this.requiredString(user, 'campus'),
      faculty: this.requiredString(user, 'facultad', 'faculty'),
      universityId: 'uat',
    };
  }

  private async request<T>(
    path: string,
    options: {
      method: 'GET' | 'POST';
      body?: string;
      token?: string;
      rawResponse?: boolean;
    },
  ): Promise<T> {
    if (!this.baseUrl) {
      throw new AuthError('EXPO_PUBLIC_UAT_API_URL no está configurada.', 'SERVER_ERROR');
    }

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method: options.method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        },
        body: options.body,
      });
    } catch {
      throw new AuthError('No fue posible conectar con la UAT.', 'NETWORK_ERROR');
    }

    if (options.rawResponse) return response as T;
    if (response.status === 401 && options.token) {
      throw new AuthError('La sesión institucional expiró.', 'TOKEN_EXPIRED');
    }
    if (response.status === 400 || response.status === 401 || response.status === 403) {
      throw new AuthError('Las credenciales institucionales no son válidas.', 'INVALID_CREDENTIALS');
    }
    if (!response.ok) {
      throw new AuthError('El servidor institucional no está disponible.', 'SERVER_ERROR');
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new AuthError('La UAT devolvió una respuesta inválida.', 'INVALID_RESPONSE');
    }
  }

  private asRecord(value: unknown): UatUserPayload | null {
    return typeof value === 'object' && value !== null ? (value as UatUserPayload) : null;
  }

  private readString(payload: UatAuthPayload, ...keys: string[]): string | undefined {
    const record = payload as Record<string, unknown>;
    for (const key of keys) if (typeof record[key] === 'string') return record[key];
    return undefined;
  }

  private requiredString(payload: UatUserPayload, ...keys: string[]): string {
    for (const key of keys) if (typeof payload[key] === 'string') return payload[key] as string;
    throw new AuthError(`Falta el campo institucional: ${keys[0]}.`, 'INVALID_RESPONSE');
  }
}
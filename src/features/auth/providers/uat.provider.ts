import type { IAuthProvider } from '@/features/auth/providers/auth-provider.interface';
import {
  AuthError,
  type AuthCredentials,
  type AuthResponse,
  type InstitutionalUserProfile,
} from '@/features/auth/types/auth.types';

type ApiPayload = Record<string, unknown>;

export class UATAuthProvider implements IAuthProvider {
  private readonly baseUrl = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const payload = await this.request('/api/v1/auth/institutional', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return this.readAuthResponse(payload);
  }

  async verifySession(token: string): Promise<boolean> {
    try {
      await this.request('/api/v1/auth/me', { method: 'GET', token });
      return true;
    } catch (error) {
      if (error instanceof AuthError && error.code === 'TOKEN_EXPIRED') return false;
      throw error;
    }
  }

  async getUserProfile(token: string): Promise<InstitutionalUserProfile> {
    const payload = await this.request('/api/v1/auth/me', { method: 'GET', token });
    return this.readUser(this.asRecord(payload.user));
  }

  private async request(
    path: string,
    options: { method: 'GET' | 'POST'; body?: string; token?: string },
  ): Promise<ApiPayload> {
    if (!this.baseUrl) throw new AuthError('EXPO_PUBLIC_API_URL no está configurada.', 'SERVER_ERROR');

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
      throw new AuthError('No fue posible conectar con el servidor.', 'NETWORK_ERROR');
    }

    let payload: ApiPayload = {};
    try { payload = await response.json() as ApiPayload; } catch { /* Se reporta abajo. */ }
    if (response.status === 401 && options.token) {
      throw new AuthError('La sesión institucional expiró.', 'TOKEN_EXPIRED');
    }
    if (response.status === 401) {
      throw new AuthError(this.readString(payload, 'message') ?? 'Las credenciales institucionales no son válidas.', 'INVALID_CREDENTIALS');
    }
    if (!response.ok) {
      throw new AuthError(this.readString(payload, 'message') ?? 'El servicio institucional no está disponible.', 'SERVER_ERROR');
    }
    return payload;
  }

  private readAuthResponse(payload: ApiPayload): AuthResponse {
    const accessToken = this.readString(payload, 'accessToken', 'access_token');
    if (!accessToken) throw new AuthError('La respuesta no contiene un access token.', 'INVALID_RESPONSE');
    return { accessToken, user: this.readUser(this.asRecord(payload.user)) };
  }

  private readUser(user: ApiPayload | null): InstitutionalUserProfile {
    if (!user) throw new AuthError('La respuesta no contiene el perfil institucional.', 'INVALID_RESPONSE');
    return {
      id: this.requiredString(user, 'id'),
      fullName: this.requiredString(user, 'fullName', 'name'),
      institutionalEmail: this.requiredString(user, 'email', 'institutionalEmail'),
      studentId: this.readString(user, 'studentId') ?? '',
      campus: this.readString(user, 'campus') ?? '',
      faculty: this.readString(user, 'faculty') ?? '',
      universityId: 'uat',
    };
  }

  private asRecord(value: unknown): ApiPayload | null {
    return typeof value === 'object' && value !== null ? value as ApiPayload : null;
  }

  private readString(payload: ApiPayload, ...keys: string[]): string | undefined {
    for (const key of keys) if (typeof payload[key] === 'string') return payload[key] as string;
    return undefined;
  }

  private requiredString(payload: ApiPayload, ...keys: string[]): string {
    const value = this.readString(payload, ...keys);
    if (value) return value;
    throw new AuthError(`Falta el campo ${keys[0]} en el perfil.`, 'INVALID_RESPONSE');
  }
}

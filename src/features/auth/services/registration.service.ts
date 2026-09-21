import {
  AuthError,
  type AuthApiErrorResponse,
  type AuthResponse,
  type RegisterCompleteDto,
} from '@/features/auth/types/auth.types';

const API_ROOT = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

type ApiAuthPayload = Record<string, unknown>;

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? value as Record<string, unknown> : null;
}

function readString(record: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) if (typeof record[key] === 'string' && record[key]) return record[key] as string;
  return undefined;
}

function normalizeResponse(payload: ApiAuthPayload): AuthResponse {
  const source = asRecord(payload.data) ?? payload;
  const user = asRecord(source.user) ?? asRecord(payload.user);
  const accessToken = readString(source, 'accessToken', 'access_token', 'token');
  if (!accessToken || !user) {
    throw new AuthError('El servidor devolvió una respuesta de autenticación inválida.', 'INVALID_RESPONSE');
  }

  const id = readString(user, 'id', '_id', 'userId', 'user_id');
  const fullName = readString(user, 'fullName', 'full_name', 'name', 'nombre');
  const email = readString(user, 'email', 'institutionalEmail', 'correo');
  if (!id || !fullName || !email) {
    throw new AuthError('No fue posible identificar al usuario autenticado.', 'INVALID_RESPONSE');
  }

  const roleRaw = readString(user, 'role');
  const role: 'driver' | 'passenger' = roleRaw === 'driver' ? 'driver' : 'passenger';

  return {
    accessToken,
    refreshToken: readString(source, 'refreshToken', 'refresh_token'),
    user: {
      id,
      fullName,
      email,
      role,
      institutionalEmail: email,
      studentId: readString(user, 'studentId', 'student_id', 'matricula') ?? '',
      campus: readString(user, 'campus') ?? '',
      faculty: readString(user, 'faculty', 'facultad') ?? '',
      universityId: readString(user, 'universityId', 'university_id') ?? 'uat',
      institution: asRecord(user.institution) as any ?? null,
    },
  };
}

export const registrationService = {
  async registerComplete(data: RegisterCompleteDto): Promise<AuthResponse> {
    if (!API_ROOT) throw new AuthError('EXPO_PUBLIC_API_URL no está configurada.', 'SERVER_ERROR');

    let response: Response;
    try {
      response = await fetch(`${API_ROOT}/api/v1/auth/register-complete`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      throw new AuthError('No fue posible conectar con el servidor. Revisa tu conexión.', 'NETWORK_ERROR');
    }

    let payload: ApiAuthPayload = {};
    try {
      payload = (await response.json()) as ApiAuthPayload;
    } catch {
      if (response.ok) throw new AuthError('El servidor devolvió una respuesta inválida.', 'INVALID_RESPONSE');
    }

    if (!response.ok) {
      const error = payload as AuthApiErrorResponse;
      const code = error.error;
      if (code === 'STUDENT_ALREADY_LINKED' || response.status === 409) {
        if (code === 'EMAIL_ALREADY_EXISTS') {
          throw new AuthError(error.message ?? 'Ya existe una cuenta con este correo.', 'EMAIL_ALREADY_EXISTS');
        }
        throw new AuthError(
          error.message ?? 'Esta matrícula ya se encuentra vinculada a otra cuenta.',
          'STUDENT_ALREADY_LINKED',
        );
      }
      if (response.status === 401) {
        throw new AuthError(
          error.message ?? 'El correo o la contraseña institucional no son correctos.',
          'INVALID_CREDENTIALS',
        );
      }
      throw new AuthError(
        error.message ?? error.error ?? 'No fue posible completar el registro.',
        response.status === 422 ? 'VALIDATION_ERROR' : 'SERVER_ERROR',
        error.errors,
      );
    }

    return normalizeResponse(payload);
  },
};

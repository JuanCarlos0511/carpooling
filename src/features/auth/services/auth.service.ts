import {
  AuthError,
  type AuthApiErrorResponse,
  type AuthResponse,
  type LoginDto,
  type RegisterDto,
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

  return {
    accessToken,
    refreshToken: readString(source, 'refreshToken', 'refresh_token'),
    user: {
      id,
      fullName,
      institutionalEmail: email,
      studentId: readString(user, 'studentId', 'student_id', 'matricula') ?? '',
      campus: readString(user, 'campus') ?? '',
      faculty: readString(user, 'faculty', 'facultad') ?? '',
      universityId: readString(user, 'universityId', 'university_id') ?? 'api',
    },
  };
}

async function request(path: string, body: LoginDto | RegisterDto): Promise<AuthResponse> {
  if (!API_ROOT) throw new AuthError('EXPO_PUBLIC_API_URL no está configurada.', 'SERVER_ERROR');

  let response: Response;
  try {
    response = await fetch(`${API_ROOT}${path}`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new AuthError('No fue posible conectar con el servidor. Revisa tu conexión.', 'NETWORK_ERROR');
  }

  let payload: ApiAuthPayload = {};
  try {
    payload = await response.json() as ApiAuthPayload;
  } catch {
    if (response.ok) throw new AuthError('El servidor devolvió una respuesta inválida.', 'INVALID_RESPONSE');
  }

  if (!response.ok) {
    const error = payload as AuthApiErrorResponse;
    const fallback = response.status === 401
      ? 'El correo o la contraseña no son correctos.'
      : 'No fue posible completar la solicitud.';
    throw new AuthError(
      error.message ?? error.error ?? fallback,
      response.status === 401 ? 'INVALID_CREDENTIALS' : response.status === 422 ? 'VALIDATION_ERROR' : 'SERVER_ERROR',
      error.errors,
    );
  }

  return normalizeResponse(payload);
}

export const authService = {
  login: (credentials: LoginDto) => request('/api/v1/auth/login', credentials),
  register: (account: RegisterDto) => request('/api/v1/auth/register', account),
};

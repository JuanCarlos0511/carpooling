import {
  AuthError,
  type AuthApiErrorResponse,
  type AuthCredentials,
  type InstitutionalVerification,
} from '@/features/auth/types/auth.types';

const API_ROOT = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

type ApiVerificationPayload = {
  verification?: InstitutionalVerification;
  error?: string;
  message?: string;
};

export const institutionalService = {
  async verifyInstitutional(credentials: AuthCredentials): Promise<InstitutionalVerification> {
    if (!API_ROOT) throw new AuthError('EXPO_PUBLIC_API_URL no está configurada.', 'SERVER_ERROR');

    let response: Response;
    try {
      response = await fetch(`${API_ROOT}/api/v1/auth/institutional-verify`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
    } catch {
      throw new AuthError('No fue posible conectar con el servidor. Revisa tu conexión.', 'NETWORK_ERROR');
    }

    let payload: ApiVerificationPayload = {};
    try {
      payload = (await response.json()) as ApiVerificationPayload;
    } catch {
      if (response.ok) throw new AuthError('El servidor devolvió una respuesta inválida.', 'INVALID_RESPONSE');
    }

    if (!response.ok) {
      const errPayload = payload as AuthApiErrorResponse;
      const code = errPayload.error;
      if (code === 'STUDENT_ALREADY_LINKED' || response.status === 409) {
        throw new AuthError(
          errPayload.message ?? 'Esta matrícula ya se encuentra vinculada a otra cuenta registrada.',
          'STUDENT_ALREADY_LINKED',
        );
      }
      if (code === 'STUDENT_NOT_CURRENT' || code === 'STUDENT_NOT_ACTIVE') {
        throw new AuthError(
          errPayload.message ?? 'La cuenta no acredita inscripción o estado activo en el semestre actual.',
          code === 'STUDENT_NOT_CURRENT' ? 'STUDENT_NOT_CURRENT' : 'STUDENT_NOT_ACTIVE',
        );
      }
      if (response.status === 401) {
        throw new AuthError(
          errPayload.message ?? 'El correo o la contraseña institucional no son correctos.',
          'INVALID_CREDENTIALS',
        );
      }
      throw new AuthError(
        errPayload.message ?? 'No fue posible verificar la cuenta institucional.',
        'SERVER_ERROR',
      );
    }

    if (!payload.verification) {
      throw new AuthError('No se recibieron los datos de verificación de la institución.', 'INVALID_RESPONSE');
    }

    return payload.verification;
  },
};

import { z } from 'zod';

const emailSchema = z.string().trim().min(1, 'El correo electrónico es obligatorio.')
  .email('Ingresa un correo electrónico válido.');

const passwordSchema = z.string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres.')
  .regex(/[A-Z]/, 'Incluye al menos una letra mayúscula.')
  .regex(/[0-9]/, 'Incluye al menos un número.');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es obligatoria.'),
  rememberMe: z.boolean(),
});

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Ingresa tu nombre completo.').max(100),
  email: emailSchema,
  password: passwordSchema,
  acceptTerms: z.boolean().refine(Boolean, 'Debes aceptar los términos y la política de privacidad.'),
});

export const institutionalLoginSchema = z.object({
  username: z.string().trim().min(3, 'Ingresa tu correo o matrícula institucional.'),
  password: z.string().min(1, 'La contraseña es obligatoria.'),
});

export const registerCompleteSchema = z.object({
  fullName: z.string().trim().min(2, 'Ingresa tu nombre completo.').max(100),
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(['driver', 'passenger']),
  institutional: institutionalLoginSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type InstitutionalLoginFormValues = z.infer<typeof institutionalLoginSchema>;
export type RegisterCompleteFormValues = z.infer<typeof registerCompleteSchema>;
export type LoginDto = Pick<LoginFormValues, 'email' | 'password'>;
export type RegisterDto = Pick<RegisterFormValues, 'fullName' | 'email' | 'password'>;
export type RegisterCompleteDto = {
  fullName: string;
  email: string;
  password: string;
  role: 'driver' | 'passenger';
  institutional: {
    username: string;
    password: string;
  };
};

export type InstitutionalVerification = {
  fullName: string;
  studentId: string;
  institutionalEmail: string;
  period: string;
  status: string;
  campus: string;
  program?: string;
};

export type AuthCredentials = {
  username: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken?: string;
  user: InstitutionalUserProfile;
};

export type AuthApiErrorResponse = {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

export type InstitutionalUserProfile = {
  role?: 'driver' | 'passenger';
  id: string;
  studentId: string;
  fullName: string;
  email?: string;
  institutionalEmail: string;
  campus: string;
  faculty: string;
  universityId: string;
  institution?: {
    institutionId: string;
    studentId: string;
    institutionalEmail: string;
    period: string;
    status: string;
    campus: string;
    program?: string;
    verifiedAt?: string;
  } | null;
};

export type UniversityId = 'uat' | 'api' | (string & {});

export type AuthStatus =
  | 'idle'
  | 'authenticating'
  | 'authenticated'
  | 'unauthenticated';

export type PersistedSession = {
  token: string;
  user: InstitutionalUserProfile;
  universityId: UniversityId;
  expiresAt?: string;
};

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'INVALID_CREDENTIALS'
      | 'VALIDATION_ERROR'
      | 'NETWORK_ERROR'
      | 'SERVER_ERROR'
      | 'TOKEN_EXPIRED'
      | 'UNSUPPORTED_PROVIDER'
      | 'INVALID_RESPONSE'
      | 'STUDENT_ALREADY_LINKED'
      | 'EMAIL_ALREADY_EXISTS'
      | 'UAT_AUTH_FAILED'
      | 'STUDENT_NOT_ACTIVE'
      | 'STUDENT_NOT_CURRENT',
    public readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

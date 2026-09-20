import type {
  AuthCredentials,
  AuthResponse,
  InstitutionalUserProfile,
} from '@/features/auth/types/auth.types';

export interface IAuthProvider {
  login(credentials: AuthCredentials): Promise<AuthResponse>;
  verifySession(token: string): Promise<boolean>;
  refreshToken?(refreshToken: string): Promise<AuthResponse>;
  getUserProfile(token: string): Promise<InstitutionalUserProfile>;
}
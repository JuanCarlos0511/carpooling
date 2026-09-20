export type AuthCredentials = {
  username: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken?: string;
  user: InstitutionalUserProfile;
};

export type InstitutionalUserProfile = {
  id: string;
  studentId: string;
  fullName: string;
  institutionalEmail: string;
  campus: string;
  faculty: string;
  universityId: string;
};

export type UniversityId = 'uat' | (string & {});

export type AuthStatus =
  | 'idle'
  | 'authenticating'
  | 'authenticated'
  | 'unauthenticated';

export type PersistedSession = {
  token: string;
  user: InstitutionalUserProfile;
  universityId: UniversityId;
};

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'INVALID_CREDENTIALS'
      | 'NETWORK_ERROR'
      | 'SERVER_ERROR'
      | 'TOKEN_EXPIRED'
      | 'UNSUPPORTED_PROVIDER'
      | 'INVALID_RESPONSE',
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
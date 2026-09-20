import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { getAuthProvider } from '@/features/auth/services/auth-factory.service';
import {
  AuthError,
  type AuthCredentials,
  type AuthStatus,
  type InstitutionalUserProfile,
  type UniversityId,
} from '@/features/auth/types/auth.types';
import { secureStorage } from '@/services/storage/secure-storage.service';

type AuthContextValue = {
  status: AuthStatus;
  user: InstitutionalUserProfile | null;
  activeUniversity: UniversityId | null;
  loginWithUniversity: (universityId: UniversityId, credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [user, setUser] = useState<InstitutionalUserProfile | null>(null);
  const [activeUniversity, setActiveUniversity] = useState<UniversityId | null>(null);

  const value = useMemo<AuthContextValue>(() => ({
    status,
    user,
    activeUniversity,
    async loginWithUniversity(universityId, credentials) {
      setStatus('authenticating');
      try {
        const response = await getAuthProvider(universityId).login(credentials);
        await secureStorage.saveSession(
          { token: response.accessToken, user: response.user, universityId },
          response.refreshToken,
        );
        setUser(response.user);
        setActiveUniversity(universityId);
        setStatus('authenticated');
      } catch (error) {
        setStatus('unauthenticated');
        throw error instanceof AuthError
          ? error
          : new AuthError('No fue posible iniciar sesión.', 'SERVER_ERROR');
      }
    },
    async logout() {
      await secureStorage.clearSession();
      setUser(null);
      setActiveUniversity(null);
      setStatus('unauthenticated');
    },
    async restoreSession() {
      const session = await secureStorage.getSession();
      if (!session) {
        setStatus('unauthenticated');
        return;
      }
      const provider = getAuthProvider(session.universityId);
      if (!(await provider.verifySession(session.token))) {
        await secureStorage.clearSession();
        setStatus('unauthenticated');
        return;
      }
      setUser(session.user);
      setActiveUniversity(session.universityId);
      setStatus('authenticated');
    },
  }), [activeUniversity, status, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider.');
  return context;
}
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { getAuthProvider } from '@/features/auth/services/auth-factory.service';
import {
  AuthError,
  type AuthCredentials,
  type AuthResponse,
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
  completeAuthentication: (response: AuthResponse, rememberSession: boolean) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [user, setUser] = useState<InstitutionalUserProfile | null>(null);
  const [activeUniversity, setActiveUniversity] = useState<UniversityId | null>(null);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const session = await secureStorage.getSession();
        if (!mounted) return;
        if (!session) {
          setStatus('unauthenticated');
          return;
        }
        if (session.universityId !== 'api') {
          const valid = await getAuthProvider(session.universityId).verifySession(session.token);
          if (!valid) {
            await secureStorage.clearSession();
            if (mounted) setStatus('unauthenticated');
            return;
          }
        }
        if (!mounted) return;
        setUser(session.user);
        setActiveUniversity(session.universityId);
        setStatus('authenticated');
      } catch {
        if (mounted) setStatus('unauthenticated');
      }
    })();
    return () => { mounted = false; };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    status,
    user,
    activeUniversity,
    async completeAuthentication(response, rememberSession) {
      if (rememberSession) {
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        await secureStorage.saveSession(
          { token: response.accessToken, user: response.user, universityId: 'api', expiresAt },
          response.refreshToken,
        );
      } else {
        await secureStorage.clearSession();
      }
      setUser(response.user);
      setActiveUniversity('api');
      setStatus('authenticated');
    },
    async loginWithUniversity(universityId, credentials) {
      setStatus('authenticating');
      try {
        const response = await getAuthProvider(universityId).login(credentials);
        await secureStorage.saveSession(
          {
            token: response.accessToken,
            user: response.user,
            universityId,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
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
      if (session.universityId !== 'api') {
        const provider = getAuthProvider(session.universityId);
        if (!(await provider.verifySession(session.token))) {
          await secureStorage.clearSession();
          setStatus('unauthenticated');
          return;
        }
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

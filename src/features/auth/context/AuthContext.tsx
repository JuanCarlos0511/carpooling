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
  accessToken: string | null;
  activeUniversity: UniversityId | null;
  loginWithUniversity: (universityId: UniversityId, credentials: AuthCredentials) => Promise<void>;
  completeAuthentication: (response: AuthResponse, rememberSession: boolean) => Promise<void>;
  changeRole: (role: 'driver' | 'passenger') => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [user, setUser] = useState<InstitutionalUserProfile | null>(null);
  const [activeUniversity, setActiveUniversity] = useState<UniversityId | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

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
        setAccessToken(session.token);
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
    accessToken,
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
      setAccessToken(response.accessToken);
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
        setAccessToken(response.accessToken);
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
      setAccessToken(null);
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
      setAccessToken(session.token);
      setActiveUniversity(session.universityId);
      setStatus('authenticated');
    },
    async changeRole(role) {
      const apiRoot = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');
      if (!apiRoot || !accessToken || !user) {
        throw new AuthError('No hay una sesión válida para cambiar de modo.', 'SERVER_ERROR');
      }
      let response: Response;
      try {
        response = await fetch(`${apiRoot}/api/v1/users/me/role`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ role }),
        });
      } catch {
        throw new AuthError('No fue posible conectar con el servidor.', 'NETWORK_ERROR');
      }
      if (!response.ok) throw new AuthError('No fue posible cambiar de modo.', 'SERVER_ERROR');
      const payload = await response.json() as { user?: { role?: string } };
      if (payload.user?.role !== role) throw new AuthError('El servidor no confirmó el cambio de modo.', 'INVALID_RESPONSE');
      const updatedUser = { ...user, role };
      const session = await secureStorage.getSession();
      if (session) {
        await secureStorage.saveSession({ ...session, user: updatedUser }, await secureStorage.getRefreshToken() ?? undefined);
      }
      setUser(updatedUser);
    },
  }), [accessToken, activeUniversity, status, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider.');
  return context;
}

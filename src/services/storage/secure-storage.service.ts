import * as SecureStore from 'expo-secure-store';

import type {
  InstitutionalUserProfile,
  PersistedSession,
  UniversityId,
} from '@/features/auth/types/auth.types';

const keys = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
  universityId: 'selected_university_id',
  userSession: 'user_session',
} as const;

export const secureStorage = {
  async saveSession(session: PersistedSession, refreshToken?: string): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(keys.accessToken, session.token),
      SecureStore.setItemAsync(keys.universityId, session.universityId),
      SecureStore.setItemAsync(keys.userSession, JSON.stringify(session.user)),
      refreshToken
        ? SecureStore.setItemAsync(keys.refreshToken, refreshToken)
        : SecureStore.deleteItemAsync(keys.refreshToken),
    ]);
  },

  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(keys.accessToken);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(keys.refreshToken);
  },

  async getSession(): Promise<PersistedSession | null> {
    const [token, universityId, rawUser] = await Promise.all([
      SecureStore.getItemAsync(keys.accessToken),
      SecureStore.getItemAsync(keys.universityId),
      SecureStore.getItemAsync(keys.userSession),
    ]);
    if (!token || !universityId || !rawUser) return null;

    try {
      return {
        token,
        universityId: universityId as UniversityId,
        user: JSON.parse(rawUser) as InstitutionalUserProfile,
      };
    } catch {
      await secureStorage.clearSession();
      return null;
    }
  },

  async clearSession(): Promise<void> {
    await Promise.all(Object.values(keys).map((key) => SecureStore.deleteItemAsync(key)));
  },
};
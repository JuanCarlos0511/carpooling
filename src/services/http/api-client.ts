import { secureStorage } from '@/services/storage/secure-storage.service';

export async function apiRequest<T>(input: RequestInfo | URL, init: RequestInit = {}): Promise<T> {
  const token = await secureStorage.getAccessToken();
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(input, { ...init, headers });
  if (response.status === 401) {
    await secureStorage.clearSession();
    throw new Error('AUTH_TOKEN_EXPIRED');
  }
  if (!response.ok) throw new Error(`HTTP_${response.status}`);
  return (await response.json()) as T;
}
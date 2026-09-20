import { AuthError, type UniversityId } from '@/features/auth/types/auth.types';
import { UATAuthProvider } from '@/features/auth/providers/uat.provider';
import type { IAuthProvider } from '@/features/auth/providers/auth-provider.interface';

const providers: Record<string, () => IAuthProvider> = {
  uat: () => new UATAuthProvider(),
};

export function getAuthProvider(universityId: UniversityId): IAuthProvider {
  const createProvider = providers[universityId];
  if (!createProvider) {
    throw new AuthError(`No existe proveedor para ${universityId}.`, 'UNSUPPORTED_PROVIDER');
  }
  return createProvider();
}
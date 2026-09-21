import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/features/auth/context/AuthContext';
import {
  AuthError,
  institutionalLoginSchema,
  type InstitutionalLoginFormValues,
} from '@/features/auth/types/auth.types';

export function useInstitutionalLoginForm() {
  const router = useRouter();
  const { loginWithUniversity } = useAuth();
  const form = useForm<InstitutionalLoginFormValues>({
    resolver: zodResolver(institutionalLoginSchema),
    defaultValues: { username: '', password: '' },
    mode: 'onTouched',
  });

  const onSubmit = form.handleSubmit(async ({ username, password }) => {
    form.clearErrors('root');
    try {
      await loginWithUniversity('uat', { username: username.trim().toLowerCase(), password });
      router.replace('/');
    } catch (error) {
      form.setError('root.server', {
        message: error instanceof AuthError ? error.message : 'No fue posible verificar tu cuenta.',
      });
    }
  });

  return { ...form, onSubmit, isSubmitting: form.formState.isSubmitting };
}

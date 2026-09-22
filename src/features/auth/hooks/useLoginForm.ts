import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/features/auth/context/AuthContext';
import { authService } from '@/features/auth/services/auth.service';
import { AuthError, loginSchema, type LoginFormValues } from '@/features/auth/types/auth.types';

export function useLoginForm() {
  const router = useRouter();
  const { completeAuthentication } = useAuth();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  const onSubmit = form.handleSubmit(async ({ email, password }) => {
    form.clearErrors('root');
    try {
      const response = await authService.login({ email: email.trim().toLowerCase(), password });
      await completeAuthentication(response, false);
      router.replace('/');
    } catch (error) {
      form.setError('root.server', {
        message: error instanceof AuthError ? error.message : 'Ocurrió un error inesperado.',
      });
    }
  });

  return { ...form, onSubmit, isSubmitting: form.formState.isSubmitting };
}

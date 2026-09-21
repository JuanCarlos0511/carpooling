import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/features/auth/context/AuthContext';
import { authService } from '@/features/auth/services/auth.service';
import { AuthError, registerSchema, type RegisterFormValues } from '@/features/auth/types/auth.types';

export function useRegisterForm() {
  const router = useRouter();
  const { completeAuthentication } = useAuth();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', acceptTerms: false },
    mode: 'onTouched',
  });

  const onSubmit = form.handleSubmit(async ({ fullName, email, password }) => {
    form.clearErrors('root');
    try {
      const response = await authService.register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      await completeAuthentication(response, true);
      router.replace('/');
    } catch (error) {
      form.setError('root.server', {
        message: error instanceof AuthError ? error.message : 'Ocurrió un error inesperado.',
      });
    }
  });

  return { ...form, onSubmit, isSubmitting: form.formState.isSubmitting };
}

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import { useRegistrationDraft } from '@/features/auth/context/RegistrationDraftContext';
import { registerSchema, type RegisterFormValues } from '@/features/auth/types/auth.types';

export function useRegisterForm() {
  const router = useRouter();
  const { draft, saveDraft } = useRegistrationDraft();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: draft ?? { fullName: '', email: '', password: '', acceptTerms: false },
    mode: 'onTouched',
  });

  const onSubmit = form.handleSubmit((values) => {
    saveDraft({ ...values, fullName: values.fullName.trim(), email: values.email.trim().toLowerCase() });
    router.push('/complete-registration');
  });

  return { ...form, onSubmit, isSubmitting: form.formState.isSubmitting };
}

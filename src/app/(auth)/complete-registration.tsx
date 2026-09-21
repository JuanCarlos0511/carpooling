import { Redirect } from 'expo-router';
import { CompleteRegistrationScreen } from '@/features/auth/components/CompleteRegistrationScreen';
import { useRegistrationDraft } from '@/features/auth/context/RegistrationDraftContext';
import { useCompleteRegistrationForm } from '@/features/auth/hooks/useCompleteRegistrationForm';

export default function CompleteRegistrationRoute() {
  const { draft } = useRegistrationDraft();
  const form = useCompleteRegistrationForm();
  if (!draft) return <Redirect href="/register" />;
  return <CompleteRegistrationScreen {...form} />;
}

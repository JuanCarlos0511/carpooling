import { useState } from 'react';
import { useRouter } from 'expo-router';

import { useAuth } from '@/features/auth/context/AuthContext';
import { useRegistrationDraft } from '@/features/auth/context/RegistrationDraftContext';
import { authService } from '@/features/auth/services/auth.service';
import {
  AuthError,
  type InstitutionalVerification,
} from '@/features/auth/types/auth.types';

export function useCompleteRegistrationForm() {
  const router = useRouter();
  const { completeAuthentication } = useAuth();
  const { draft, clearDraft } = useRegistrationDraft();

  const [role, setRole] = useState<'driver' | 'passenger'>('driver');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verification, setVerification] = useState<InstitutionalVerification | null>(null);
  const [institutionalError, setInstitutionalError] = useState<string>();
  const [submitError, setSubmitError] = useState<string>();
  const [isLinking, setIsLinking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canLinkAccount = username.trim().length >= 3 && password.length >= 1;

  const onLinkAccount = async () => {
    if (!canLinkAccount || isLinking || isSubmitting) return;
    setIsLinking(true);
    setInstitutionalError(undefined);
    setSubmitError(undefined);

    try {
      const result = await authService.verifyInstitutional({
        username: username.trim().toLowerCase(),
        password,
      });
      setVerification(result);
    } catch (error) {
      setInstitutionalError(
        error instanceof AuthError ? error.message : 'No fue posible validar la cuenta institucional.',
      );
    } finally {
      setIsLinking(false);
    }
  };

  const onUnlinkAccount = () => {
    setVerification(null);
    setInstitutionalError(undefined);
    setSubmitError(undefined);
  };

  const onCompleteRegistration = async () => {
    if (!verification) {
      setSubmitError('Enlaza tu cuenta institucional para habilitar el registro.');
      return;
    }

    if (!draft) {
      router.replace('/register');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(undefined);

    try {
      const response = await authService.registerComplete({
        fullName: draft.fullName,
        email: draft.email,
        password: draft.password,
        role,
        institutional: {
          username: username.trim().toLowerCase(),
          password,
        },
      });

      await completeAuthentication(response, true);
      clearDraft();
      router.replace('/');
    } catch (error) {
      setSubmitError(
        error instanceof AuthError ? error.message : 'Ocurrió un error al completar el registro.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    role,
    onRoleChange: setRole,
    username,
    onUsernameChange: setUsername,
    password,
    onPasswordChange: setPassword,
    canLinkAccount,
    verification,
    institutionalError,
    submitError,
    isLinking,
    isSubmitting,
    onLinkAccount,
    onUnlinkAccount,
    onCompleteRegistration,
    onBack: () => router.back(),
  };
}

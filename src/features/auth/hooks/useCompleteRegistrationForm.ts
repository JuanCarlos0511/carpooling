import { useState } from 'react';
import { useRouter } from 'expo-router';

export function useCompleteRegistrationForm() {
  const router = useRouter();
  const [role, setRole] = useState<'driver' | 'passenger'>('driver');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [institutionalError, setInstitutionalError] = useState<string>();
  return {
    role, onRoleChange: setRole, username, onUsernameChange: setUsername, password, onPasswordChange: setPassword,
    canLinkAccount: false,
    verification: null,
    institutionalError,
    onLinkAccount: () => setInstitutionalError('La verificación institucional todavía no está disponible.'),
    onUnlinkAccount: () => setInstitutionalError(undefined),
    onCompleteRegistration: () => setInstitutionalError('Enlaza tu cuenta institucional antes de continuar.'),
    onBack: () => router.back(),
  };
}

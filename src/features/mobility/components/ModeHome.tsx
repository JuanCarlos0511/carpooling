import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { useAppTheme } from '@/constants/theme';
import { useAuth } from '@/features/auth/context/AuthContext';

export function ModeHome({ role }: { role: 'driver' | 'passenger' }) {
  const theme = useAppTheme();
  const router = useRouter();
  const { logout, changeRole } = useAuth();
  const [leaving, setLeaving] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState<string>();
  const styles = StyleSheet.create({
    screen: { flex: 1, justifyContent: 'center', padding: theme.spacing.lg, gap: theme.spacing.lg, backgroundColor: theme.colors.background },
    title: { textAlign: 'center', color: theme.colors.textPrimary, fontSize: theme.typography.size.title, fontWeight: theme.typography.weight.bold },
    error: { color: theme.colors.danger },
  });

  const signOut = async () => {
    setLeaving(true);
    try {
      await logout();
      router.replace('/login');
    } catch {
      setError('No fue posible cerrar la sesión. Vuelve a intentarlo.');
    } finally {
      setLeaving(false);
    }
  };

  const switchRole = async () => {
    setError(undefined);
    setSwitching(true);
    try {
      const nextRole = role === 'driver' ? 'passenger' : 'driver';
      await changeRole(nextRole);
      router.replace(nextRole === 'driver' ? '/driver' : '/passenger');
    } catch {
      setError('No fue posible cambiar de modo. Vuelve a intentarlo.');
    } finally {
      setSwitching(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Text accessibilityRole="header" style={styles.title}>{role === 'driver' ? 'Chofer' : 'Pasajero'}</Text>
      <Button title={role === 'driver' ? 'Cambiar a pasajero' : 'Cambiar a chofer'} variant="outline"
        loading={switching} onPress={() => void switchRole()} />
      <Button title="Cerrar sesión" loading={leaving} onPress={() => void signOut()} />
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    </SafeAreaView>
  );
}

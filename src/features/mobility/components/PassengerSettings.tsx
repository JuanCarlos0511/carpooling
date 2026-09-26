import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LogOut, Repeat2, UserRound } from 'lucide-react-native';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type AppTheme, useAppTheme } from '@/constants/theme';
import { useAuth } from '@/features/auth/context/AuthContext';

export function PassengerSettings() {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const router = useRouter();
  const { user, logout, changeRole } = useAuth();
  const [leaving, setLeaving] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState<string>();

  async function signOut() {
    setError(undefined);
    setLeaving(true);
    try {
      await logout();
      router.replace('/login');
    } catch {
      setError('No fue posible cerrar la sesión. Vuelve a intentarlo.');
      setLeaving(false);
    }
  }

  async function switchToDriver() {
    setError(undefined);
    setSwitching(true);
    try {
      await changeRole('driver');
      router.replace('/driver');
    } catch {
      setError('No fue posible cambiar de modo. Vuelve a intentarlo.');
    } finally {
      setSwitching(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>TU CUENTA</Text>
        <Text accessibilityRole="header" style={styles.title}>Configuración</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}><UserRound size={28} color={theme.colors.accentStrong} /></View>
          <View style={styles.profileText}>
            <Text style={styles.name} numberOfLines={1}>{user?.fullName || 'Pasajero'}</Text>
            <Text style={styles.subtitle} numberOfLines={1}>{user?.institutionalEmail || user?.email || 'Cuenta universitaria'}</Text>
            <Text style={styles.subtitle}>Modo pasajero</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Opciones</Text>
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" disabled={switching} onPress={() => void switchToDriver()} style={styles.action}>
            {switching ? <ActivityIndicator size="small" color={theme.colors.textPrimary} /> : <Repeat2 size={21} color={theme.colors.textPrimary} />}
            <Text style={styles.actionText}>Cambiar a conductor</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable accessibilityRole="button" disabled={leaving} onPress={() => void signOut()} style={styles.action}>
            {leaving ? <ActivityIndicator size="small" color={theme.colors.danger} /> : <LogOut size={21} color={theme.colors.danger} />}
            <Text style={[styles.actionText, { color: theme.colors.danger }]}>Cerrar sesión</Text>
          </Pressable>
        </View>
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(theme: AppTheme) {
  const { colors, spacing, borderRadius, typography } = theme;
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { width: '100%', maxWidth: 620, alignSelf: 'center', padding: spacing.md, paddingBottom: spacing.xxl },
    eyebrow: { color: colors.accentStrong, fontSize: typography.size.label, fontWeight: typography.weight.bold,
      letterSpacing: typography.letterSpacing.label, marginTop: spacing.md },
    title: { color: colors.textPrimary, fontSize: typography.size.title, fontWeight: typography.weight.bold, marginTop: spacing.xs,
      marginBottom: spacing.lg },
    profileCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md,
      backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: borderRadius.lg },
    avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceElevated },
    profileText: { flex: 1, minWidth: 0 },
    name: { color: colors.textPrimary, fontSize: typography.size.subtitle, fontWeight: typography.weight.bold },
    subtitle: { color: colors.textSecondary, fontSize: typography.size.bodySmall, marginTop: spacing.xs },
    sectionTitle: { color: colors.textPrimary, fontSize: typography.size.subtitle, fontWeight: typography.weight.semibold,
      marginTop: spacing.xl, marginBottom: spacing.md },
    actions: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.md },
    action: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    actionText: { color: colors.textPrimary, fontSize: typography.size.body, fontWeight: typography.weight.semibold },
    divider: { height: 1, backgroundColor: colors.border },
    error: { color: colors.danger, fontSize: typography.size.bodySmall, marginTop: spacing.md },
  });
}

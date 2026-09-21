import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { type AppTheme, useAppTheme } from '@/constants/theme';
import { AuthScaffold } from '@/features/auth/components/AuthScaffold';
import { EncryptionNotice } from '@/features/auth/components/AuthShared';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const returnToLogin = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/login');
  };
  return (
    <AuthScaffold
      badge="NUEVA CUENTA"
      title="Crea tu cuenta"
      subtitle="Únete a la plataforma segura de viajes compartidos"
      footer={
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿Ya posees una cuenta? </Text>
            <Pressable accessibilityRole="button" hitSlop={theme.spacing.sm} onPress={returnToLogin}>
              <Text style={styles.link}>Iniciar sesión</Text>
            </Pressable>
          </View>
          <EncryptionNotice />
        </View>
      }
    >
      <RegisterForm />
    </AuthScaffold>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    footer: { alignItems: 'center', gap: theme.spacing.md },
    footerRow: { flexDirection: 'row' },
    footerText: { color: theme.colors.textSecondary, fontSize: theme.typography.size.bodySmall },
    link: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.size.bodySmall,
      fontWeight: theme.typography.weight.semibold,
    },
  });
}

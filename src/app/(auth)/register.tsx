import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { type AppTheme, useAppTheme } from '@/constants/theme';
import { AuthScaffold } from '@/features/auth/components/AuthScaffold';
import { EncryptionNotice } from '@/features/auth/components/AuthShared';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <AuthScaffold
      badge="NUEVA CUENTA"
      title="Crea tu cuenta"
      subtitle="Únete a la plataforma segura de viajes compartidos"
      footer={
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿Ya posees una cuenta? </Text>
            <Link href="/login" style={styles.link}>Iniciar sesión</Link>
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
    link: { color: theme.colors.textPrimary, fontSize: theme.typography.size.bodySmall, fontWeight: theme.typography.weight.semibold },
  });
}

import { Link } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { type AppTheme, useAppTheme } from '@/constants/theme';
import { AuthScaffold } from '@/features/auth/components/AuthScaffold';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <AuthScaffold
      title="Bienvenido"
      subtitle="Ingresa a tu cuenta"
      footer={
        <View style={styles.footerColumn}>
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
            <Link href="/register" style={styles.link}>Crear cuenta</Link>
          </View>
          <Link href="/uat-login" style={styles.institutionalLink}>Usar cuenta institucional UAT</Link>
          <View style={styles.legalRow}>
            <Pressable onPress={() => Alert.alert('Términos de servicio', 'El documento legal se publicará antes del lanzamiento.')}>
              <Text style={styles.legalLink}>Términos de servicio</Text>
            </Pressable>
            <Text style={styles.legalDot}>·</Text>
            <Pressable onPress={() => Alert.alert('Política de privacidad', 'El documento legal se publicará antes del lanzamiento.')}>
              <Text style={styles.legalLink}>Política de privacidad</Text>
            </Pressable>
          </View>
        </View>
      }
    >
      <LoginForm />
    </AuthScaffold>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    footer: { flexDirection: 'row' },
    footerColumn: { alignItems: 'center', gap: theme.spacing.md },
    footerText: { color: theme.colors.textSecondary, fontSize: theme.typography.size.bodySmall },
    link: { color: theme.colors.textPrimary, fontSize: theme.typography.size.bodySmall, fontWeight: theme.typography.weight.semibold },
    institutionalLink: { color: theme.colors.textSecondary, fontSize: theme.typography.size.bodySmall, textDecorationLine: 'underline' },
    legalRow: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.sm },
    legalLink: { color: theme.colors.textMuted, fontSize: theme.typography.size.caption, textDecorationLine: 'underline' },
    legalDot: { color: theme.colors.textMuted, fontSize: theme.typography.size.caption },
  });
}

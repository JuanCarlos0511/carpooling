import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { type AppTheme, useAppTheme } from '@/constants/theme';
import { AuthScaffold } from '@/features/auth/components/AuthScaffold';
import { InstitutionalLoginForm } from '@/features/auth/components/InstitutionalLoginForm';

export default function UatLoginScreen() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <AuthScaffold
      badge="CUENTA INSTITUCIONAL"
      title="Verifica tu identidad"
      subtitle="Conecta tu cuenta UAT para acceder a la comunidad universitaria"
      footer={<Link href="/login" style={styles.link}>Volver al inicio de sesión</Link>}
    >
      <InstitutionalLoginForm />
    </AuthScaffold>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    link: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.size.bodySmall,
      fontWeight: theme.typography.weight.semibold,
    },
  });
}

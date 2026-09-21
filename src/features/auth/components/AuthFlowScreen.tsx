import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { Alert, BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';

import { type AppTheme, useAppTheme } from '@/constants/theme';
import { AuthCardCarousel, type AuthMode } from '@/features/auth/components/AuthCardCarousel';
import { AuthScaffold } from '@/features/auth/components/AuthScaffold';
import { EncryptionNotice } from '@/features/auth/components/AuthShared';

export function AuthFlowScreen({ initialMode }: { initialMode: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const isLogin = mode === 'login';

  useEffect(() => {
    if (isLogin) return undefined;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setMode('login');
      return true;
    });
    return () => subscription.remove();
  }, [isLogin]);

  return (
    <AuthScaffold
      badge={isLogin ? undefined : 'NUEVA CUENTA'}
      contained={false}
      title={isLogin ? 'Bienvenido' : 'Crea tu cuenta'}
      subtitle={isLogin
        ? 'Ingresa a tu cuenta'
        : 'Únete a la plataforma segura de viajes compartidos'}
      footer={isLogin
        ? <LoginFooter onCreateAccount={() => setMode('register')} styles={styles} />
        : <RegisterFooter onLogin={() => setMode('login')} styles={styles} />}
    >
      <AuthCardCarousel mode={mode} />
    </AuthScaffold>
  );
}

type Styles = ReturnType<typeof createStyles>;

function LoginFooter({ onCreateAccount, styles }: { onCreateAccount: () => void; styles: Styles }) {
  return (
    <View style={styles.footerColumn}>
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
        <Pressable accessibilityRole="button" onPress={onCreateAccount}>
          <Text style={styles.link}>Crear cuenta</Text>
        </Pressable>
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
  );
}

function RegisterFooter({ onLogin, styles }: { onLogin: () => void; styles: Styles }) {
  const theme = useAppTheme();
  return (
    <View style={styles.footerColumn}>
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>¿Ya posees una cuenta? </Text>
        <Pressable
          accessibilityRole="button"
          hitSlop={theme.spacing.sm}
          onPress={onLogin}
        >
          <Text style={styles.link}>Iniciar sesión</Text>
        </Pressable>
      </View>
      <EncryptionNotice />
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    footerColumn: { alignItems: 'center', gap: theme.spacing.md },
    footerRow: { flexDirection: 'row' },
    footerText: { color: theme.colors.textSecondary, fontSize: theme.typography.size.bodySmall },
    link: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.size.bodySmall,
      fontWeight: theme.typography.weight.semibold,
    },
    institutionalLink: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.size.bodySmall,
      textDecorationLine: 'underline',
    },
    legalRow: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.sm },
    legalLink: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.size.caption,
      textDecorationLine: 'underline',
    },
    legalDot: { color: theme.colors.textMuted, fontSize: theme.typography.size.caption },
  });
}

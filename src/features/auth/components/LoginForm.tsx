import { Alert, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react-native';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { type AppTheme, useAppTheme } from '@/constants/theme';
import { AuthSeparator, ErrorBanner, SocialButtons } from '@/features/auth/components/AuthShared';
import { useLoginForm } from '@/features/auth/hooks/useLoginForm';

export function LoginForm() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { control, formState: { errors }, isSubmitting, onSubmit } = useLoginForm();
  const socialMessage = (provider: 'Google' | 'Apple') => {
    Alert.alert(`Continuar con ${provider}`, 'La configuración OAuth se conectará en una siguiente iteración.');
  };

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onBlur, onChange, value } }) => (
          <Input
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email?.message}
            Icon={Mail}
            keyboardType="email-address"
            label="Correo electrónico"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="nombre@dominio.com"
            returnKeyType="next"
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onBlur, onChange, value } }) => (
          <Input
            autoCapitalize="none"
            error={errors.password?.message}
            Icon={LockKeyhole}
            isPassword
            label="Contraseña"
            auxiliaryLabel="¿Olvidaste tu contraseña?"
            onAuxiliaryPress={() => Alert.alert('Recuperar contraseña', 'Te enviaremos instrucciones por correo próximamente.')}
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={() => void onSubmit()}
            placeholder="••••••••••"
            returnKeyType="done"
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="rememberMe"
        render={({ field: { onChange, value } }) => (
          <View style={styles.rememberRow}>
            <Checkbox checked={value} label="Recordar sesión" onChange={onChange} />
            <Text style={styles.days}>30 días</Text>
          </View>
        )}
      />
      <ErrorBanner>{errors.root?.server?.message}</ErrorBanner>
      <Button
        icon={<ArrowRight color={theme.colors.primaryForeground} size={theme.metrics.iconSize} />}
        loading={isSubmitting}
        onPress={() => void onSubmit()}
        title="Iniciar sesión"
      />
      <AuthSeparator>o continúa con</AuthSeparator>
      <SocialButtons onPress={socialMessage} />
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    form: { gap: theme.spacing.md },
    rememberRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
    days: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.size.caption,
      letterSpacing: theme.typography.letterSpacing.badge,
      textTransform: 'uppercase',
    },
  });
}

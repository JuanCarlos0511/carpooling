import { Alert, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react-native';
import { Controller, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { PasswordStrengthBar } from '@/components/ui/PasswordStrength';
import { type AppTheme, useAppTheme } from '@/constants/theme';
import { AuthSeparator, ErrorBanner, SocialButtons } from '@/features/auth/components/AuthShared';
import { useRegisterForm } from '@/features/auth/hooks/useRegisterForm';

export function RegisterForm() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { control, formState: { errors }, isSubmitting, onSubmit } = useRegisterForm();
  const password = useWatch({ control, name: 'password' });
  const socialMessage = (provider: 'Google' | 'Apple') => {
    Alert.alert(`Registrarse con ${provider}`, 'La configuración OAuth se conectará en una siguiente iteración.');
  };

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onBlur, onChange, value } }) => (
          <Input
            autoCapitalize="words"
            autoComplete="name"
            error={errors.fullName?.message}
            Icon={UserRound}
            label="Nombre completo"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Ej. Alex Vance"
            returnKeyType="next"
            value={value}
          />
        )}
      />
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
            placeholder="nombre@ejemplo.com"
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
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={() => void onSubmit()}
            placeholder="••••••••••"
            returnKeyType="done"
            value={value}
          />
        )}
      />
      <PasswordStrengthBar password={password} />
      <Controller
        control={control}
        name="acceptTerms"
        render={({ field: { onChange, value } }) => (
          <Checkbox
            accessibilityLabel="Acepto los términos y la política de privacidad"
            checked={value}
            error={errors.acceptTerms?.message}
            label={
              <Text style={styles.terms}>
                Acepto los <Text style={styles.link}>Términos y Condiciones</Text> y la{' '}
                <Text style={styles.link}>Política de Privacidad</Text>
              </Text>
            }
            onChange={onChange}
          />
        )}
      />
      <ErrorBanner>{errors.root?.server?.message}</ErrorBanner>
      <Button
        icon={<ArrowRight color={theme.colors.primaryForeground} size={theme.metrics.iconSize} />}
        loading={isSubmitting}
        onPress={() => void onSubmit()}
        title="Crear cuenta"
      />
      <AuthSeparator>o regístrate con</AuthSeparator>
      <SocialButtons onPress={socialMessage} />
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    form: { gap: theme.spacing.md },
    terms: { color: theme.colors.textSecondary, flex: 1, fontSize: theme.typography.size.bodySmall, lineHeight: theme.spacing.lg },
    link: { color: theme.colors.textPrimary, textDecorationLine: 'underline' },
  });
}

import { StyleSheet, Text, View } from 'react-native';
import { ArrowRight, GraduationCap, LockKeyhole } from 'lucide-react-native';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { type AppTheme, useAppTheme } from '@/constants/theme';
import { ErrorBanner } from '@/features/auth/components/AuthShared';
import { useInstitutionalLoginForm } from '@/features/auth/hooks/useInstitutionalLoginForm';

export function InstitutionalLoginForm() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { control, formState: { errors }, isSubmitting, onSubmit } = useInstitutionalLoginForm();
  return (
    <View style={styles.form}>
      <Text style={styles.notice}>
        Tus credenciales se usan una sola vez para verificar tu identidad y nunca se guardan en Hopn.
      </Text>
      <Controller
        control={control}
        name="username"
        render={({ field: { onBlur, onChange, value } }) => (
          <Input
            autoCapitalize="none"
            error={errors.username?.message}
            Icon={GraduationCap}
            keyboardType="email-address"
            label="Cuenta institucional"
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="matrícula@alumnos.uat.edu.mx"
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
            label="Contraseña institucional"
            onBlur={onBlur}
            onChangeText={onChange}
            onSubmitEditing={() => void onSubmit()}
            placeholder="••••••••••"
            returnKeyType="done"
            value={value}
          />
        )}
      />
      <ErrorBanner>{errors.root?.server?.message}</ErrorBanner>
      <Button
        icon={<ArrowRight color={theme.colors.primaryForeground} size={theme.metrics.iconSize} />}
        loading={isSubmitting}
        onPress={() => void onSubmit()}
        title="Verificar e iniciar sesión"
      />
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    form: { gap: theme.spacing.md },
    notice: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.size.bodySmall,
      lineHeight: theme.spacing.lg,
      textAlign: 'center',
    },
  });
}

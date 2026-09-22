import { useState, type ComponentType } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

import { type AppTheme, useAppTheme } from '@/constants/theme';

type IconComponent = ComponentType<{ color?: string; size?: number; strokeWidth?: number }>;

type InputProps = TextInputProps & {
  label: string;
  error?: string;
  Icon?: IconComponent;
  isPassword?: boolean;
  auxiliaryLabel?: string;
  onAuxiliaryPress?: () => void;
};

export function Input({
  label,
  error,
  Icon,
  isPassword,
  auxiliaryLabel,
  onAuxiliaryPress,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const ToggleIcon = passwordVisible ? EyeOff : Eye;

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {auxiliaryLabel ? (
          <Pressable accessibilityRole="button" onPress={onAuxiliaryPress} hitSlop={theme.spacing.sm}>
            <Text style={styles.auxiliary}>{auxiliaryLabel}</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={[styles.field, focused && styles.fieldFocused, error && styles.fieldError]}>
        {Icon ? <Icon color={focused ? theme.colors.focus : theme.colors.textSecondary} size={theme.metrics.iconSize} strokeWidth={1.7} /> : null}
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={theme.colors.textMuted}
          selectionColor={theme.colors.focus}
          secureTextEntry={isPassword && !passwordVisible}
          style={styles.input}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...props}
        />
        {isPassword ? (
          <Pressable
            accessibilityLabel={passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            accessibilityRole="button"
            hitSlop={theme.spacing.sm}
            onPress={() => setPasswordVisible((visible) => !visible)}
          >
            <ToggleIcon color={theme.colors.textSecondary} size={theme.metrics.iconSize} strokeWidth={1.7} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    wrapper: { gap: theme.spacing.sm },
    labelRow: { flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.sm },
    label: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.size.label,
      fontWeight: theme.typography.weight.medium,
      letterSpacing: theme.typography.letterSpacing.label,
      textTransform: 'uppercase',
    },
    auxiliary: { color: theme.colors.textSecondary, fontSize: theme.typography.size.bodySmall },
    field: {
      alignItems: 'center',
      backgroundColor: theme.colors.inputBackground,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.sm,
      borderWidth: theme.metrics.borderWidth,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      height: theme.metrics.controlHeight,
      paddingHorizontal: theme.spacing.md,
    },
    fieldFocused: { borderColor: theme.colors.focus },
    fieldError: { borderColor: theme.colors.danger },
    input: {
      color: theme.colors.textPrimary,
      flex: 1,
      fontSize: theme.typography.size.body,
      height: '100%',
      paddingVertical: theme.spacing.none,
    },
    error: { color: theme.colors.danger, fontSize: theme.typography.size.bodySmall },
  });
}

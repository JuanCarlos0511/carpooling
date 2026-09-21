import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type ViewStyle,
} from 'react-native';

import { type AppTheme, useAppTheme } from '@/constants/theme';

type ButtonVariant = 'primary' | 'outline' | 'social';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
};

export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  icon,
  style,
  ...props
}: ButtonProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const inactive = disabled || loading;
  const foreground = variant === 'primary'
    ? theme.colors.primaryForeground
    : theme.colors.textPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        inactive && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? <ActivityIndicator color={foreground} /> : icon}
      <Text style={[styles.label, { color: foreground }]}>{title}</Text>
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    base: {
      alignItems: 'center',
      borderRadius: theme.borderRadius.sm,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      height: theme.metrics.controlHeight,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.md,
    },
    primary: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      borderWidth: theme.metrics.borderWidth,
    },
    outline: {
      backgroundColor: theme.colors.transparent,
      borderColor: theme.colors.borderStrong,
      borderWidth: theme.metrics.borderWidth,
    },
    social: {
      backgroundColor: theme.colors.transparent,
      borderColor: theme.colors.border,
      borderWidth: theme.metrics.borderWidth,
      flex: 1,
    },
    label: {
      fontSize: theme.typography.size.bodySmall,
      fontWeight: theme.typography.weight.medium,
    },
    pressed: { opacity: 0.72 },
    disabled: { opacity: 0.45 },
  });
}

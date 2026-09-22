import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type ViewStyle,
} from 'react-native';

import { GradientFill } from '@/components/ui/GradientFill';
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
  const foreground = disabled
    ? theme.colors.disabledForeground
    : variant === 'primary'
      ? theme.colors.primaryForeground
      : theme.colors.textPrimary;
  const renderedIcon = variant === 'primary' && isValidElement(icon)
    ? cloneElement(icon as ReactElement<{ color?: string }>, { color: foreground })
    : icon;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.buttonDisabled,
        loading && variant !== 'primary' && styles.disabled,
        style,
      ]}
      {...props}
    >
      {variant === 'primary' && !disabled ? <GradientFill /> : null}
      {loading ? <ActivityIndicator color={foreground} /> : renderedIcon}
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
      overflow: 'hidden',
      paddingHorizontal: theme.spacing.md,
    },
    primary: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.transparent,
      borderWidth: theme.spacing.none,
    },
    buttonDisabled: {
      backgroundColor: theme.colors.disabledBackground,
      borderColor: theme.colors.border,
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

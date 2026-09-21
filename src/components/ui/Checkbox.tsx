import type { ReactNode } from 'react';
import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { type AppTheme, useAppTheme } from '@/constants/theme';

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  error?: string;
  accessibilityLabel?: string;
};

export function Checkbox({ checked, onChange, label, error, accessibilityLabel }: CheckboxProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        onPress={() => onChange(!checked)}
        style={styles.row}
      >
        <View style={[styles.box, checked && styles.boxChecked, error && styles.boxError]}>
          {checked ? <Check color={theme.colors.primaryForeground} size={theme.metrics.iconSize} /> : null}
        </View>
        {typeof label === 'string' ? <Text style={styles.label}>{label}</Text> : label}
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    wrapper: { gap: theme.spacing.xs },
    row: { alignItems: 'flex-start', flexDirection: 'row', gap: theme.spacing.sm },
    box: {
      alignItems: 'center',
      borderColor: theme.colors.borderStrong,
      borderRadius: theme.borderRadius.sm,
      borderWidth: theme.metrics.borderWidth,
      height: theme.spacing.lg,
      justifyContent: 'center',
      width: theme.spacing.lg,
    },
    boxChecked: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    boxError: { borderColor: theme.colors.danger },
    label: { color: theme.colors.textSecondary, flex: 1, fontSize: theme.typography.size.bodySmall },
    error: { color: theme.colors.danger, fontSize: theme.typography.size.bodySmall },
  });
}

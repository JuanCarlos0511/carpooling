import { CheckCircle2, Circle } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { type AppTheme, useAppTheme } from '@/constants/theme';

export function PasswordStrengthBar({ password }: { password: string }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const requirements = [
    { label: 'Mínimo 8 car.', valid: password.length >= 8 },
    { label: '1 mayúscula', valid: /[A-Z]/.test(password) },
    { label: '1 número', valid: /[0-9]/.test(password) },
  ];
  const score = requirements.filter(({ valid }) => valid).length;
  const strength = score === 3 ? 'Fuerte' : score >= 2 ? 'Media' : 'Débil';

  return (
    <View style={styles.wrapper}>
      <View style={styles.bars}>
        {requirements.map((requirement, index) => (
          <View
            key={requirement.label}
            style={[styles.bar, index < score && styles.barActive]}
          />
        ))}
        <Text style={styles.strength}>{strength}</Text>
      </View>
      <View style={styles.requirements}>
        {requirements.map(({ label, valid }) => {
          const Icon = valid ? CheckCircle2 : Circle;
          return (
            <View key={label} style={styles.requirement}>
              <Icon
                color={valid ? theme.colors.success : theme.colors.textMuted}
                size={theme.typography.size.bodySmall}
              />
              <Text style={[styles.requirementText, valid && styles.requirementValid]}>{label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    wrapper: { gap: theme.spacing.sm },
    bars: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.xs },
    bar: {
      backgroundColor: theme.colors.border,
      borderRadius: theme.borderRadius.full,
      flex: 1,
      height: theme.metrics.strengthHeight,
    },
    barActive: { backgroundColor: theme.colors.textPrimary },
    strength: { color: theme.colors.textSecondary, fontSize: theme.typography.size.caption, marginLeft: theme.spacing.xs },
    requirements: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
    requirement: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.xs },
    requirementText: { color: theme.colors.textMuted, fontSize: theme.typography.size.caption },
    requirementValid: { color: theme.colors.textSecondary },
  });
}

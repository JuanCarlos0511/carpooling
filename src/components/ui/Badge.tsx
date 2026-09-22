import { StyleSheet, Text, View } from 'react-native';

import { type AppTheme, useAppTheme } from '@/constants/theme';

export function Badge({ children }: { children: string }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.badge}>
      <View style={styles.dot} />
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    badge: {
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: theme.colors.overlay,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.full,
      borderWidth: theme.metrics.borderWidth,
      flexDirection: 'row',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    dot: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.full,
      height: theme.spacing.xs,
      width: theme.spacing.xs,
    },
    text: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.size.caption,
      fontWeight: theme.typography.weight.semibold,
      letterSpacing: theme.typography.letterSpacing.badge,
    },
  });
}

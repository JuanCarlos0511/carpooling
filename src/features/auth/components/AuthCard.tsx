import type { ReactNode } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { type AppTheme, useAppTheme } from '@/constants/theme';

type AuthCardProps = {
  children: ReactNode;
  onLayout?: (event: LayoutChangeEvent) => void;
};

export function AuthCard({ children, onLayout }: AuthCardProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return <View onLayout={onLayout} style={styles.card}>{children}</View>;
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      borderWidth: theme.metrics.borderWidth,
      padding: theme.spacing.md,
    },
  });
}

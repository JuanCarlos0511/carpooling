import type { ReactNode } from 'react';
import { Apple, LockKeyhole } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { type AppTheme, useAppTheme } from '@/constants/theme';

export function AuthSeparator({ children }: { children: string }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.separator}>
      <View style={styles.line} />
      <Text style={styles.separatorText}>{children}</Text>
      <View style={styles.line} />
    </View>
  );
}

export function SocialButtons({
  includeApple = true,
  onPress,
}: {
  includeApple?: boolean;
  onPress: (provider: 'Google' | 'Apple') => void;
}) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.socialRow}>
      <Button
        title="Google"
        variant="social"
        icon={<Text style={styles.googleIcon}>G</Text>}
        onPress={() => onPress('Google')}
      />
      {includeApple && (
        <Button
          title="Apple"
          variant="social"
          icon={<Apple color={theme.colors.textPrimary} fill={theme.colors.textPrimary} size={theme.metrics.iconSize} />}
          onPress={() => onPress('Apple')}
        />
      )}
    </View>
  );
}

export function EncryptionNotice() {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.encryption}>
      <LockKeyhole color={theme.colors.textMuted} size={theme.typography.size.bodySmall} />
      <Text style={styles.encryptionText}>Cifrado de extremo a extremo de 256 bits</Text>
    </View>
  );
}

export function ErrorBanner({ children }: { children?: ReactNode }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  if (!children) return null;
  return <Text accessibilityRole="alert" style={styles.error}>{children}</Text>;
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    separator: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.sm },
    line: { backgroundColor: theme.colors.border, flex: 1, height: theme.metrics.borderWidth },
    separatorText: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.size.caption,
      letterSpacing: theme.typography.letterSpacing.badge,
      textTransform: 'uppercase',
    },
    socialRow: { flexDirection: 'row', gap: theme.spacing.sm },
    googleIcon: { color: theme.colors.textPrimary, fontSize: theme.typography.size.subtitle, fontWeight: theme.typography.weight.bold },
    encryption: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.xs },
    encryptionText: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.size.caption,
      letterSpacing: theme.typography.letterSpacing.label,
      textTransform: 'uppercase',
    },
    error: {
      backgroundColor: theme.colors.overlay,
      borderColor: theme.colors.danger,
      borderRadius: theme.borderRadius.sm,
      borderWidth: theme.metrics.borderWidth,
      color: theme.colors.danger,
      fontSize: theme.typography.size.bodySmall,
      padding: theme.spacing.sm,
    },
  });
}

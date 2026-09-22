import type { ReactNode } from 'react';
import { Waves } from 'lucide-react-native';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/Badge';
import { GradientFill } from '@/components/ui/GradientFill';
import { type AppTheme, useAppTheme } from '@/constants/theme';
import { AuthCard } from '@/features/auth/components/AuthCard';

type AuthScaffoldProps = {
  title: string;
  subtitle: string;
  badge?: string;
  children: ReactNode;
  footer?: ReactNode;
  contained?: boolean;
};

export function AuthScaffold({
  title,
  subtitle,
  badge,
  children,
  footer,
  contained = true,
}: AuthScaffoldProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.logoFrame}>
                <View style={styles.logo}>
                  <GradientFill />
                  <Waves color={theme.colors.white} size={theme.spacing.xl} strokeWidth={1.8} />
                </View>
              </View>
              {badge ? <Badge>{badge}</Badge> : null}
              <View style={styles.heading}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>
            </View>
            {contained ? <AuthCard>{children}</AuthCard> : children}
            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    safeArea: { backgroundColor: theme.colors.background, flex: 1 },
    keyboard: { flex: 1 },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xl,
    },
    container: { alignSelf: 'center', maxWidth: theme.metrics.contentMaxWidth, width: '100%' },
    header: { alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.lg },
    logoFrame: {
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      borderWidth: theme.metrics.borderWidth,
      padding: theme.spacing.xs,
    },
    logo: {
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.sm,
      height: theme.metrics.logoSize,
      justifyContent: 'center',
      overflow: 'hidden',
      width: theme.metrics.logoSize,
    },
    heading: { alignItems: 'center', gap: theme.spacing.sm },
    title: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.size.title,
      fontWeight: theme.typography.weight.bold,
      textAlign: 'center',
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.size.body,
      lineHeight: theme.spacing.lg,
      maxWidth: theme.metrics.contentMaxWidth,
      textAlign: 'center',
    },
    footer: { alignItems: 'center', gap: theme.spacing.sm, marginTop: theme.spacing.lg },
  });
}

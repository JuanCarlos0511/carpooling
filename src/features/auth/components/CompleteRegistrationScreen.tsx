import { ArrowLeft } from 'lucide-react-native';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type AppTheme, useAppTheme } from '@/constants/theme';
import {
  CompleteRegistrationForm,
  type CompleteRegistrationFormProps,
} from '@/features/auth/components/CompleteRegistrationForm';

type CompleteRegistrationScreenProps = CompleteRegistrationFormProps & {
  onBack: () => void;
};

export function CompleteRegistrationScreen({ onBack, ...formProps }: CompleteRegistrationScreenProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const busy = Boolean(formProps.isLinking || formProps.isSubmitting);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Pressable
              accessibilityLabel="Volver a los datos de registro"
              accessibilityRole="button"
              accessibilityState={{ disabled: busy }}
              disabled={busy}
              onPress={onBack}
              style={styles.backButton}
            >
              <ArrowLeft color={theme.colors.textSecondary} size={theme.metrics.iconSize} />
              <Text style={styles.backText}>Datos de tu cuenta</Text>
            </Pressable>
            <View style={styles.header}>
              <Text accessibilityRole="header" style={styles.title}>Completa tu registro</Text>
            </View>
            <CompleteRegistrationForm {...formProps} />
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
    scrollContent: { flexGrow: 1, paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xl, paddingTop: theme.spacing.sm },
    content: { alignSelf: 'center', maxWidth: theme.metrics.contentMaxWidth, width: '100%' },
    backButton: {
      alignItems: 'center',
      alignSelf: 'flex-start',
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
      minHeight: theme.metrics.controlHeight,
    },
    backText: { color: theme.colors.textSecondary, fontSize: theme.typography.size.bodySmall },
    header: { gap: theme.spacing.md, marginBottom: theme.spacing.xl },
    title: { color: theme.colors.textPrimary, fontSize: theme.typography.size.title, fontWeight: theme.typography.weight.semibold },
  });
}

import { ArrowLeft } from 'lucide-react-native';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/Badge';
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
              <View style={styles.badge}><Badge>VERIFICACIÓN ACADÉMICA</Badge></View>
              <Text accessibilityRole="header" style={styles.title}>Completa tu registro</Text>
              <Text style={styles.subtitle}>
                Personaliza tu experiencia de viaje universitario seguro y conecta con tu campus.
              </Text>
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
    badge: { alignSelf: 'flex-start' },
    title: { color: theme.colors.textPrimary, fontSize: theme.typography.size.title, fontWeight: theme.typography.weight.semibold },
    subtitle: { color: theme.colors.textSecondary, fontSize: theme.typography.size.body, lineHeight: theme.spacing.lg },
  });
}

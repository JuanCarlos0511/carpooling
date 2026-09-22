import { useState } from 'react';
import { BadgeCheck, Check, ChevronDown, University, X } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type AppTheme, useAppTheme } from '@/constants/theme';

const institutions = [
  {
    id: 'uat',
    name: 'Universidad Autónoma de Tamaulipas',
    campus: 'UAT · Campus Sur',
  },
] as const;

// UAT es la única institución disponible; el selector conserva la interacción
// de lista para incorporar más instituciones cuando estén habilitadas.
export function InstitutionPicker({ disabled = false }: { disabled?: boolean }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [expanded, setExpanded] = useState(false);
  const institution = institutions[0];

  return (
    <>
      <Pressable
        accessibilityRole="combobox"
        accessibilityLabel="Institución universitaria"
        accessibilityValue={{ text: `${institution.name}, Campus Sur` }}
        accessibilityHint="Abre la lista de instituciones disponibles"
        accessibilityState={{ expanded, disabled }}
        disabled={disabled}
        onPress={() => setExpanded(true)}
        style={({ pressed }) => [styles.selector, pressed && styles.pressed]}
      >
        <View style={styles.institutionIcon}>
          <University color={theme.colors.accentStrong} size={theme.spacing.lg} />
        </View>
        <View style={styles.description}>
          <Text style={styles.name}>{institution.name}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.campus}>{institution.campus}</Text>
            <View style={styles.officialBadge}>
              <BadgeCheck color={theme.colors.accentStrong} size={theme.typography.size.bodySmall} />
              <Text style={styles.officialText}>Oficial</Text>
            </View>
          </View>
        </View>
        <ChevronDown color={theme.colors.textSecondary} size={theme.metrics.iconSize} />
      </Pressable>

      <Modal
        animationType="slide"
        onRequestClose={() => setExpanded(false)}
        presentationStyle="pageSheet"
        visible={expanded}
      >
        <SafeAreaView style={styles.modal}>
          <View accessibilityViewIsModal style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text accessibilityRole="header" style={styles.modalTitle}>Elige tu institución</Text>
              <Pressable
                accessibilityLabel="Cerrar instituciones"
                accessibilityRole="button"
                onPress={() => setExpanded(false)}
                style={styles.closeButton}
              >
                <X color={theme.colors.textPrimary} size={theme.spacing.lg} />
              </Pressable>
            </View>
            <Text style={styles.modalSubtitle}>Instituciones disponibles para verificar tu cuenta.</Text>
            {institutions.map((option) => (
              <Pressable
                accessibilityLabel={`${option.name}, Campus Sur`}
                accessibilityRole="radio"
                accessibilityState={{ checked: option.id === institution.id }}
                key={option.id}
                onPress={() => setExpanded(false)}
                style={({ pressed }) => [styles.selector, styles.selectedOption, pressed && styles.pressed]}
              >
                <University color={theme.colors.accentStrong} size={theme.spacing.lg} />
                <View style={styles.description}>
                  <Text style={styles.name}>{option.name}</Text>
                  <Text style={styles.campus}>{option.campus}</Text>
                </View>
                <Check color={theme.colors.accentStrong} size={theme.metrics.iconSize} />
              </Pressable>
            ))}
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    selector: {
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      borderWidth: theme.metrics.borderWidth,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
    },
    institutionIcon: {
      alignItems: 'center',
      backgroundColor: theme.colors.accentSoft,
      borderColor: theme.colors.accentStrong,
      borderRadius: theme.borderRadius.sm,
      borderWidth: theme.metrics.borderWidth,
      justifyContent: 'center',
      padding: theme.spacing.sm,
    },
    description: { flex: 1, gap: theme.spacing.sm },
    name: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.size.body,
      fontWeight: theme.typography.weight.semibold,
      lineHeight: theme.spacing.lg,
    },
    detailRow: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    campus: { color: theme.colors.textSecondary, fontSize: theme.typography.size.bodySmall },
    officialBadge: {
      alignItems: 'center',
      backgroundColor: theme.colors.accentSoft,
      borderRadius: theme.borderRadius.sm,
      flexDirection: 'row',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    officialText: { color: theme.colors.accentStrong, fontSize: theme.typography.size.caption },
    pressed: { opacity: 0.72 },
    modal: { backgroundColor: theme.colors.background, flex: 1 },
    modalContent: {
      alignSelf: 'center',
      gap: theme.spacing.md,
      maxWidth: theme.metrics.contentMaxWidth,
      padding: theme.spacing.lg,
      width: '100%',
    },
    modalHeader: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.sm },
    modalTitle: {
      color: theme.colors.textPrimary,
      flex: 1,
      fontSize: theme.typography.size.subtitle,
      fontWeight: theme.typography.weight.semibold,
    },
    closeButton: {
      alignItems: 'center',
      height: theme.metrics.controlHeight,
      justifyContent: 'center',
      width: theme.metrics.controlHeight,
    },
    modalSubtitle: { color: theme.colors.textSecondary, fontSize: theme.typography.size.body, lineHeight: theme.spacing.lg },
    selectedOption: { borderColor: theme.colors.accentStrong },
  });
}

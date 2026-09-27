import { useState } from 'react';
import { RotateCcw, X } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type AppTheme, useAppTheme } from '@/constants/theme';
import { SearchPointMap } from '@/features/mobility/components/SearchPointMap';
import { PUBLICATION_SEARCH_RADIUS_METERS, type SearchLocation } from '@/features/mobility/services/publication.service';

type Props = { value: SearchLocation | null; onConfirm: (point: SearchLocation) => void; onClose: () => void };

export function PublicationMapPicker({ value, onConfirm, onClose }: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const [point, setPoint] = useState(value);
  const [resetToken, setResetToken] = useState(0);
  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.heading}>
            <Text accessibilityRole="header" style={styles.title}>Busca cerca de un punto</Text>
            <Text style={styles.subtitle}>Mantén pulsado el mapa para marcar dónde esperarías.</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Cerrar mapa sin aplicar cambios" onPress={onClose} style={styles.iconButton}>
            <X size={22} color={theme.colors.textPrimary} />
          </Pressable>
        </View>
        <View style={styles.map}>
          <SearchPointMap point={point} onSelect={setPoint} resetToken={resetToken} />
          <Pressable accessibilityRole="button" accessibilityLabel="Volver al centro de Tampico"
            onPress={() => setResetToken((value) => value + 1)} style={[styles.iconButton, styles.resetButton]}>
            <RotateCcw size={21} color={theme.colors.textPrimary} />
          </Pressable>
        </View>
        <View style={styles.footer}>
          <Text style={styles.subtitle}>{point ? 'Punto seleccionado.' : 'Selecciona un punto para continuar.'} Buscaremos paradas a un máximo de {PUBLICATION_SEARCH_RADIUS_METERS / 1000} km en línea recta.</Text>
          <Pressable accessibilityRole="button" accessibilityState={{ disabled: !point }} disabled={!point}
            onPress={() => { if (point) onConfirm(point); }} style={[styles.confirmButton, !point && styles.disabledButton]}>
            <Text style={[styles.confirmText, !point && styles.disabledText]}>Usar esta ubicación</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function makeStyles(theme: AppTheme) {
  const { colors, spacing, borderRadius, typography } = theme;
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.sm },
    heading: { flex: 1 },
    title: { color: colors.textPrimary, fontSize: typography.size.subtitle, fontWeight: typography.weight.bold },
    subtitle: { color: colors.textSecondary, fontSize: typography.size.bodySmall, lineHeight: 19, marginTop: spacing.xs },
    iconButton: { width: 44, height: 44, borderRadius: borderRadius.md, backgroundColor: colors.surface,
      borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
    map: { flex: 1 },
    resetButton: { position: 'absolute', right: spacing.md, top: spacing.md },
    footer: { padding: spacing.md, gap: spacing.md },
    confirmButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent,
      borderRadius: borderRadius.md },
    confirmText: { color: theme.dark ? colors.background : colors.primaryForeground, fontSize: typography.size.body,
      fontWeight: typography.weight.bold },
    disabledButton: { backgroundColor: colors.neutralDisabledBackground },
    disabledText: { color: colors.neutralDisabledForeground },
  });
}

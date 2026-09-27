import { CarFront } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { type AppTheme, useAppTheme } from '@/constants/theme';
import { PublicationTiming } from '@/features/mobility/components/PublicationTiming';
import { passengerSeats, type PublicationTrip } from '@/features/mobility/services/publication.service';

export function PublicationSummaryCard({ trip }: { trip: PublicationTrip }) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const seats = passengerSeats(trip);

  return (
    <View style={styles.card}>
      <PublicationTiming trip={trip} />
      <View style={styles.divider} />
      <View style={styles.metricRow}>
        <View><Text style={styles.metricLabel}>APORTACIÓN TOTAL</Text><Text style={styles.metricValue}>${trip.price} MXN</Text></View>
        <View style={styles.seatsMetric} accessible accessibilityLabel={`${seats.available} de ${seats.capacity} asientos libres para pasajeros`}>
          <CarFront size={18} color={theme.colors.accentStrong} />
          <Text style={styles.seatsMetricText}>{seats.available} de {seats.capacity} libres</Text>
        </View>
      </View>
      <Text style={styles.capacityNote}>Los lugares corresponden solo a pasajeros.</Text>
    </View>
  );
}

function makeStyles(theme: AppTheme) {
  const { colors, spacing, borderRadius, typography } = theme;
  return StyleSheet.create({
    card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: borderRadius.lg, padding: spacing.md },
    divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
    metricRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
    metricLabel: { color: colors.textMuted, fontSize: typography.size.label, fontWeight: typography.weight.bold,
      letterSpacing: typography.letterSpacing.label },
    metricValue: { color: colors.textPrimary, fontSize: 22, fontWeight: typography.weight.bold, marginTop: spacing.xs },
    seatsMetric: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    seatsMetricText: { color: colors.accentStrong, fontSize: typography.size.bodySmall, fontWeight: typography.weight.semibold },
    capacityNote: { color: colors.textMuted, fontSize: typography.size.bodySmall, marginTop: spacing.sm },
  });
}

import { MapPin } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { type AppTheme, useAppTheme } from '@/constants/theme';
import { PassengerAvatar } from '@/features/mobility/components/PassengerAvatar';
import type { AgreedTrip } from '@/features/mobility/services/passenger-trip.service';
import { formatDeparture } from '@/features/mobility/services/publication.service';

export function AgreedTripCard({ agreedTrip, onDetails }: { agreedTrip: AgreedTrip; onDetails: () => void }) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  return (
    <>
      <View style={styles.sectionHeading}>
        <View>
          <Text style={styles.eyebrow}>TU PRÓXIMO VIAJE</Text>
          <Text style={styles.sectionTitle}>Todo listo para salir</Text>
        </View>
        <View style={styles.confirmedBadge}><View style={styles.confirmedDot} /><Text style={styles.confirmedText}>CONFIRMADO</Text></View>
      </View>

      <View style={styles.upcomingCard}>
        <View style={styles.upcomingMain}>
          <PassengerAvatar name={agreedTrip.trip.driver.fullName} size={60} theme={theme} />
          <View style={styles.driverDetails}>
            <Text style={styles.driverName} numberOfLines={1}>{agreedTrip.trip.driver.fullName}</Text>
            <Text style={styles.routeText} numberOfLines={2}>
              {agreedTrip.trip.route.origin.name} → {agreedTrip.trip.route.destination.name}
            </Text>
          </View>
          <View style={styles.pinBlock}>
            <Text style={styles.pinLabel}>PIN</Text>
            <Text style={styles.pinValue}>{agreedTrip.boardingPin ?? '—'}</Text>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.meetingRow}>
          <MapPin size={19} color={theme.colors.accent} />
          <Text style={styles.meetingText}>Punto de encuentro: <Text style={styles.meetingStrong}>{agreedTrip.boardingStop.name}</Text></Text>
        </View>
        <Text style={styles.departureText}>{formatDeparture(agreedTrip.boardingStop.scheduledAt)}</Text>
        <Pressable accessibilityRole="link" accessibilityLabel="Ver detalles de la ruta activa"
          onPress={onDetails} style={({ pressed }) => [styles.tripDetailsLink, pressed && styles.tripDetailsLinkPressed]}>
          <Text style={styles.tripDetailsLinkText}>Ver detalles</Text>
        </Pressable>
      </View>
    </>
  );
}

function makeStyles(theme: AppTheme) {
  const { colors, spacing, borderRadius, typography } = theme;
  return StyleSheet.create({
    sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: spacing.sm, marginBottom: spacing.md },
    eyebrow: { color: colors.accentStrong, fontSize: typography.size.label, fontWeight: typography.weight.bold,
      letterSpacing: typography.letterSpacing.label, marginBottom: spacing.xs },
    sectionTitle: { color: colors.textPrimary, fontSize: 21, fontWeight: typography.weight.bold, lineHeight: 27 },
    confirmedBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, borderWidth: 1, borderColor: colors.border,
      backgroundColor: colors.surface, borderRadius: borderRadius.full, paddingVertical: 7, paddingHorizontal: 9 },
    confirmedDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
    confirmedText: { color: colors.textSecondary, fontSize: 9, fontWeight: typography.weight.bold, letterSpacing: 0.6 },
    upcomingCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.lg, padding: spacing.md },
    upcomingMain: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    driverDetails: { flex: 1, minWidth: 0 },
    driverName: { color: colors.textPrimary, fontSize: typography.size.subtitle, fontWeight: typography.weight.bold },
    routeText: { color: colors.textSecondary, fontSize: typography.size.bodySmall, marginTop: spacing.xs, lineHeight: 18 },
    pinBlock: { borderLeftWidth: 1, borderLeftColor: colors.border, paddingLeft: spacing.sm, alignItems: 'center' },
    pinLabel: { color: colors.textMuted, fontSize: typography.size.label, fontWeight: typography.weight.semibold,
      letterSpacing: typography.letterSpacing.label },
    pinValue: { color: colors.accentStrong, fontSize: 23, fontWeight: typography.weight.bold, letterSpacing: 2, marginTop: spacing.xs },
    separator: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
    meetingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    meetingText: { color: colors.textSecondary, fontSize: typography.size.bodySmall, flex: 1, lineHeight: 19 },
    meetingStrong: { color: colors.textPrimary, fontWeight: typography.weight.semibold },
    departureText: { color: colors.textMuted, fontSize: typography.size.bodySmall, marginLeft: 27, marginTop: spacing.xs },
    tripDetailsLink: { alignSelf: 'flex-end', minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.xs, marginTop: spacing.xs },
    tripDetailsLinkPressed: { opacity: 0.65 },
    tripDetailsLinkText: { color: colors.accentStrong, fontSize: typography.size.bodySmall, fontWeight: typography.weight.bold },
  });
}

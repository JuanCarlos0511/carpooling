import { Clock3, MapPin } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { type AppTheme, useAppTheme } from '@/constants/theme';
import { formatDeparture, formatHour, type PublicationTrip } from '@/features/mobility/services/publication.service';

export function PublicationTiming({ trip }: { trip: Pick<PublicationTrip, 'stops' | 'arrivalAt'> }) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const firstStop = trip.stops.find((stop) => stop.kind === 'stop');

  return (
    <View style={styles.group}>
      {firstStop ? <View style={styles.row}>
        <Clock3 size={19} color={theme.colors.accentStrong} />
        <Text style={styles.text}>Primera parada <Text style={styles.strong}>{formatDeparture(firstStop.scheduledAt)}</Text></Text>
      </View> : null}
      <View style={styles.row}>
        <MapPin size={19} color={theme.colors.accentStrong} />
        <Text style={styles.text}>Llegada estimada <Text style={styles.strong}>{formatHour(trip.arrivalAt)} hrs</Text></Text>
      </View>
    </View>
  );
}

function makeStyles(theme: AppTheme) {
  const { colors, spacing, typography } = theme;
  return StyleSheet.create({
    group: { gap: spacing.sm },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    text: { color: colors.textSecondary, fontSize: typography.size.bodySmall, lineHeight: 19, flex: 1 },
    strong: { color: colors.textPrimary, fontWeight: typography.weight.semibold },
  });
}

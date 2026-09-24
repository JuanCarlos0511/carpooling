import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/constants/theme';
import type { TripWaypoint } from '@/features/mobility/data/passenger-home.data';

type Props = { point: TripWaypoint; side: 'left' | 'right' };

export function WaypointDetails({ point, side }: Props) {
  const theme = useAppTheme();
  const complete = point.status === 'Completada';

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={[styles.pointer, side === 'left' ? styles.pointerRight : styles.pointerLeft,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} />
      <Text style={[styles.name, { color: theme.colors.textPrimary }]} numberOfLines={2}>{point.name}</Text>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Hora estimada de llegada</Text>
      <Text style={[styles.time, { color: theme.colors.textPrimary }]}>{point.arrivalTime}</Text>
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: complete ? theme.colors.success : theme.colors.accent }]} />
        <Text style={[styles.status, { color: complete ? theme.colors.success : theme.colors.accentStrong }]}>
          {point.status}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: 190, padding: 12, borderRadius: 12, borderWidth: 1, elevation: 7, shadowColor: '#000', shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 3 }, shadowRadius: 8 },
  pointer: { position: 'absolute', top: '50%', width: 12, height: 12, borderWidth: 1, transform: [{ translateY: -6 }, { rotate: '45deg' }] },
  pointerLeft: { left: -7, borderTopWidth: 0, borderRightWidth: 0 },
  pointerRight: { right: -7, borderBottomWidth: 0, borderLeftWidth: 0 },
  name: { fontSize: 13, fontWeight: '700', lineHeight: 18 },
  label: { fontSize: 11, marginTop: 9 },
  time: { fontSize: 17, fontWeight: '700', marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 9 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  status: { fontSize: 12, fontWeight: '600' },
});

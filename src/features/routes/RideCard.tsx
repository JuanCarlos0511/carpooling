import { Text, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import type { Ride } from '@/features/routes/ride.types';

type RideCardProps = {
  ride: Ride;
};

export function RideCard({ ride }: RideCardProps) {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderRadius: 12,
        borderWidth: 1,
        gap: spacing.xs,
        marginBottom: spacing.md,
        padding: spacing.md,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 17, fontWeight: '700' }}>
        {ride.origin} - {ride.destination}
      </Text>
      <Text style={{ color: colors.muted }}>Salida {ride.departure}</Text>
      <Text style={{ color: colors.primary, fontWeight: '600' }}>
        {ride.seatsAvailable} plazas disponibles
      </Text>
    </View>
  );
}

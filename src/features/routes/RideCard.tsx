import { Text, View } from 'react-native';

import { useAppTheme } from '@/constants/theme';
import type { Ride } from '@/features/routes/ride.types';

type RideCardProps = {
  ride: Ride;
};

export function RideCard({ ride }: RideCardProps) {
  const theme = useAppTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        borderWidth: theme.metrics.borderWidth,
        gap: theme.spacing.xs,
        marginBottom: theme.spacing.md,
        padding: theme.spacing.md,
      }}
    >
      <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.size.subtitle, fontWeight: theme.typography.weight.bold }}>
        {ride.origin} - {ride.destination}
      </Text>
      <Text style={{ color: theme.colors.textSecondary }}>Salida {ride.departure}</Text>
      <Text style={{ color: theme.colors.accentStrong, fontWeight: theme.typography.weight.semibold }}>
        {ride.seatsAvailable} plazas disponibles
      </Text>
    </View>
  );
}

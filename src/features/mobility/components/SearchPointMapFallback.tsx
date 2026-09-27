import { Text, View } from 'react-native';
import { useAppTheme } from '@/constants/theme';
import type { SearchLocation } from '@/features/mobility/services/publication.service';

export type SearchPointMapProps = { point: SearchLocation | null; onSelect: (point: SearchLocation) => void; resetToken: number };

export function SearchPointMapUnavailable() {
  const theme = useAppTheme();
  return <View style={{ flex: 1, justifyContent: 'center', padding: theme.spacing.lg, backgroundColor: theme.colors.background }}>
    <Text style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>
      La selección en el mapa está disponible en la app instalada. Puedes cerrar esta ventana y buscar por nombre de parada.
    </Text>
  </View>;
}

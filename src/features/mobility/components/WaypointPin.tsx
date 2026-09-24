import { Flag } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/constants/theme';

type Props = { number: number; destination: boolean; selected: boolean };

export function WaypointPin({ number, destination, selected }: Props) {
  const theme = useAppTheme();

  return (
    <View style={styles.hitArea}>
      <View style={[styles.pin, {
        backgroundColor: destination ? theme.colors.primary : theme.colors.accent,
        borderColor: selected ? theme.colors.white : '#E5E7EB',
        transform: [{ scale: selected ? 1.12 : 1 }],
      }]}>
        {destination ? <Flag size={17} strokeWidth={2.7} color="#FFFFFF" />
          : <Text style={styles.number}>{number}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hitArea: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center' },
  pin: { width: 34, height: 34, borderRadius: 17, borderWidth: 3, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  number: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', lineHeight: 18 },
});

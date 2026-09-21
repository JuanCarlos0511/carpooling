import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { Redirect } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

import { RideCard } from '@/features/routes/RideCard';
import { colors, spacing } from '@/constants/theme';
import { useRides } from '@/features/routes/useRides';
import { useAuth } from '@/features/auth/context/AuthContext';

export default function HomeScreen() {
  const { rides } = useRides();
  const { status } = useAuth();

  if (status === 'idle' || status === 'authenticating') {
    return (
      <View style={{ alignItems: 'center', backgroundColor: colors.background, flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (status === 'unauthenticated') return <Redirect href="/login" />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlashList
        contentContainerStyle={{ padding: spacing.lg }}
        data={rides}
        ListHeaderComponent={
          <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
            <Image
              source={{ uri: rides[0]?.imageUrl }}
              contentFit="cover"
              style={{ width: '100%', height: 180, borderRadius: 16 }}
              cachePolicy="memory-disk"
            />
            <Text style={{ color: colors.text, fontSize: 28, fontWeight: '700' }}>
              Comparte tu trayecto
            </Text>
            <Text style={{ color: colors.muted, fontSize: 16 }}>
              Encuentra viajes cercanos y muévete de forma más eficiente.
            </Text>
          </View>
        }
        renderItem={({ item }) => <RideCard ride={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

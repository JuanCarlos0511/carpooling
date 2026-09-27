import { Stack } from 'expo-router';

import { useAppTheme } from '@/constants/theme';

export default function PublicationStackLayout() {
  const theme = useAppTheme();
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}>
    <Stack.Screen name="[id]" />
  </Stack>;
}

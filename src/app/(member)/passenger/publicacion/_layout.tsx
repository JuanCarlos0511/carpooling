import { Stack } from 'expo-router';

import { useAppTheme } from '@/constants/theme';

export default function PublicationStackLayout() {
  const theme = useAppTheme();
  return <Stack screenOptions={{ headerStyle: { backgroundColor: theme.colors.surface },
    headerTintColor: theme.colors.textPrimary, contentStyle: { backgroundColor: theme.colors.background } }}>
    <Stack.Screen name="[id]" options={{ title: 'Publicación' }} />
  </Stack>;
}

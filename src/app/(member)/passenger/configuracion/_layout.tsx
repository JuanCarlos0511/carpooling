import { Stack } from 'expo-router';

import { useAppTheme } from '@/constants/theme';

export const unstable_settings = { anchor: 'index' };

export default function SettingsStackLayout() {
  const theme = useAppTheme();
  return <Stack screenOptions={{ headerStyle: { backgroundColor: theme.colors.surface },
    headerTintColor: theme.colors.textPrimary, contentStyle: { backgroundColor: theme.colors.background } }}>
    <Stack.Screen name="index" options={{ headerShown: false }} />
  </Stack>;
}

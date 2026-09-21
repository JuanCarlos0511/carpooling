import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { useAppTheme } from '@/constants/theme';

import { AuthProvider } from '@/features/auth/context/AuthContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useAppTheme();
  return (
    <AuthProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }} />
    </AuthProvider>
  );
}

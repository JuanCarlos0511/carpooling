import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAppTheme } from '@/constants/theme';
import { useAuth } from '@/features/auth/context/AuthContext';

export default function MemberLayout() {
  const { status } = useAuth();
  const theme = useAppTheme();
  if (status === 'idle' || status === 'authenticating') {
    return <View style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.colors.background }}><ActivityIndicator color={theme.colors.textPrimary} /></View>;
  }
  if (status !== 'authenticated') return <Redirect href="/login" />;
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }} />;
}

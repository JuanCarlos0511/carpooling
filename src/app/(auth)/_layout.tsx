import { Stack } from 'expo-router';
import { useAppTheme } from '@/constants/theme';
import { RegistrationDraftProvider } from '@/features/auth/context/RegistrationDraftContext';

export default function AuthLayout() {
  const theme = useAppTheme();
  return (
    <RegistrationDraftProvider>
      <Stack screenOptions={{ animation: 'none', headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}>
        <Stack.Screen name="complete-registration" options={{ animation: 'slide_from_right', gestureEnabled: true }} />
      </Stack>
    </RegistrationDraftProvider>
  );
}

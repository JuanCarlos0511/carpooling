import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        animationTypeForReplace: 'pop',
        gestureEnabled: true,
        headerShown: false,
        presentation: 'card',
      }}
    />
  );
}

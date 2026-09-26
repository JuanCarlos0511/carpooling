import { Tabs } from 'expo-router';
import { ClipboardList, House, Search, Settings2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/constants/theme';

export default function PassengerTabsLayout() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs backBehavior="history" screenOptions={{
      headerShown: false,
      lazy: true,
      freezeOnBlur: true,
      popToTopOnBlur: false,
      tabBarActiveTintColor: theme.colors.accentStrong,
      tabBarInactiveTintColor: theme.colors.textMuted,
      tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border,
        borderTopWidth: 1, height: 72 + insets.bottom, paddingTop: 8, paddingBottom: insets.bottom + 8 },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      sceneStyle: { backgroundColor: theme.colors.background },
    }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="principal" options={{ title: 'Principal',
        tabBarIcon: ({ color, size }) => <House color={color} size={size} /> }} />
      <Tabs.Screen name="buscar" options={{ title: 'Buscar',
        tabBarIcon: ({ color, size }) => <Search color={color} size={size} /> }} />
      <Tabs.Screen name="rutas-solicitadas" options={{ title: 'Rutas Solicitadas',
        tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} /> }} />
      <Tabs.Screen name="configuracion" options={{ title: 'Configuración',
        tabBarIcon: ({ color, size }) => <Settings2 color={color} size={size} /> }} />
      <Tabs.Screen name="detalles" options={{ href: null }} />
      <Tabs.Screen name="publicacion" options={{ href: null }} />
    </Tabs>
  );
}

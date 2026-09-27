import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { LogOut, Repeat2, Route, UsersRound } from 'lucide-react-native';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientFill } from '@/components/ui/GradientFill';
import { type AppTheme, useAppTheme } from '@/constants/theme';
import { useAuth } from '@/features/auth/context/AuthContext';
import { AgreedTripCard } from '@/features/mobility/components/AgreedTripCard';
import { PassengerAvatar } from '@/features/mobility/components/PassengerAvatar';
import { PublicationFeedCard } from '@/features/mobility/components/PublicationFeedCard';
import { passengerHomeData } from '@/features/mobility/data/passenger-home.data';
import { useAgreedTrip } from '@/features/mobility/hooks/useAgreedTrip';
import { getMyPublicationRequests, getOpenPublications, hasActivePublicationRequest,
  type PublicationTrip } from '@/features/mobility/services/publication.service';

export function PassengerHome() {
  const theme = useAppTheme();
  const router = useRouter();
  const { user, accessToken, logout, changeRole } = useAuth();
  const { trip: agreedTrip, error: agreedTripError, retry: retryAgreedTrip } = useAgreedTrip(accessToken);
  const [menuOpen, setMenuOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState<string>();
  const [publications, setPublications] = useState<PublicationTrip[]>([]);
  const [requestedTripIds, setRequestedTripIds] = useState<Set<string>>(() => new Set());
  const [publicationsLoading, setPublicationsLoading] = useState(true);
  const [publicationsError, setPublicationsError] = useState<string>();
  const [reloadToken, setReloadToken] = useState(0);
  const styles = makeStyles(theme);
  const { brand } = passengerHomeData;
  const displayName = user?.fullName || 'Pasajero';

  useFocusEffect(useCallback(() => {
    const controller = new AbortController();
    setPublicationsLoading(true);
    setPublicationsError(undefined);
    void Promise.all([
      getOpenPublications(controller.signal),
      accessToken ? getMyPublicationRequests(accessToken, controller.signal) : Promise.resolve([]),
    ])
      .then(([trips, requests]) => {
        if (controller.signal.aborted) return;
        setPublications(trips);
        setRequestedTripIds(new Set(requests.filter(hasActivePublicationRequest).map((request) => request.tripId)));
      })
      .catch(() => {
        if (!controller.signal.aborted) setPublicationsError('No fue posible cargar las publicaciones.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setPublicationsLoading(false);
      });
    return () => controller.abort();
  }, [accessToken, reloadToken]));

  async function signOut() {
    setError(undefined);
    setLeaving(true);
    try {
      await logout();
      router.replace('/login');
    } catch {
      setError('No fue posible cerrar la sesión. Vuelve a intentarlo.');
      setLeaving(false);
    }
  }

  async function switchToDriver() {
    setError(undefined);
    setSwitching(true);
    try {
      await changeRole('driver');
      router.replace('/driver');
    } catch {
      setError('No fue posible cambiar de modo. Vuelve a intentarlo.');
    } finally {
      setSwitching(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}><GradientFill /><Route size={24} color={theme.colors.white} strokeWidth={2.4} /></View>
            <View>
              <Text accessibilityRole="header" style={styles.brandName}>{brand.name}<Text style={{ color: theme.colors.accent }}> •</Text></Text>
              <Text style={styles.brandSubtitle}>{brand.subtitle}</Text>
            </View>
          </View>
          <Pressable accessibilityLabel={`Opciones de ${displayName}`} accessibilityRole="button" accessibilityState={{ expanded: menuOpen }}
            onPress={() => setMenuOpen((value) => !value)} style={styles.profileButton}>
            <PassengerAvatar name={displayName} size={44} theme={theme} />
          </Pressable>
        </View>

        {menuOpen ? (
          <View style={styles.menu}>
            <Text style={styles.menuName} numberOfLines={1}>{displayName}</Text>
            <Text style={styles.menuSubtitle}>Modo pasajero</Text>
            <View style={styles.menuRule} />
            <Pressable accessibilityRole="button" disabled={switching} onPress={() => void switchToDriver()} style={styles.menuAction}>
              {switching ? <ActivityIndicator size="small" color={theme.colors.textSecondary} /> : <Repeat2 size={18} color={theme.colors.textSecondary} />}
              <Text style={styles.menuActionText}>Cambiar a conductor</Text>
            </Pressable>
            <Pressable accessibilityRole="button" disabled={leaving} onPress={() => void signOut()} style={styles.menuAction}>
              {leaving ? <ActivityIndicator size="small" color={theme.colors.textSecondary} /> : <LogOut size={18} color={theme.colors.textSecondary} />}
              <Text style={styles.menuActionText}>Cerrar sesión</Text>
            </Pressable>
            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          </View>
        ) : null}

        {agreedTrip ? <AgreedTripCard agreedTrip={agreedTrip} onDetails={() => router.push('/passenger/detalles')} /> : null}

        <View style={[styles.sectionHeading, agreedTrip && styles.feedHeading]}>
          <View>
            <Text style={styles.eyebrow}>PARA TI</Text>
            <Text style={styles.sectionTitle}>Viajes de la comunidad</Text>
          </View>
          <UsersRound size={21} color={theme.colors.textMuted} />
        </View>

        {agreedTripError ? (
          <View style={styles.feedStatus}>
            <Text accessibilityRole="alert" style={styles.feedStatusText}>{agreedTripError}</Text>
            <Pressable accessibilityRole="button" onPress={retryAgreedTrip} style={styles.retryButton}>
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          </View>
        ) : null}

        {publicationsLoading ? (
          <View style={styles.feedStatus}><ActivityIndicator color={theme.colors.accentStrong} /><Text style={styles.feedStatusText}>Cargando publicaciones…</Text></View>
        ) : publicationsError ? (
          <View style={styles.feedStatus}>
            <Text accessibilityRole="alert" style={styles.feedStatusText}>{publicationsError}</Text>
            <Pressable accessibilityRole="button" onPress={() => setReloadToken((value) => value + 1)} style={styles.retryButton}>
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          </View>
        ) : publications.length === 0 ? (
          <View style={styles.feedStatus}><Text style={styles.feedStatusText}>Todavía no hay publicaciones abiertas con lugares disponibles.</Text></View>
        ) : publications.map((trip) => <PublicationFeedCard key={trip.id} trip={trip} hasRequest={requestedTripIds.has(trip.id)} />)}
        <Text style={styles.bottomNote}>Viaja acompañado, llega mejor.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(theme: AppTheme) {
  const { colors, spacing, typography, borderRadius } = theme;
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    scrollContent: { width: '100%', maxWidth: 620, alignSelf: 'center', paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
    header: { minHeight: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
    brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    brandMark: { width: 46, height: 46, borderRadius: borderRadius.lg, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
    brandName: { color: colors.textPrimary, fontSize: 22, fontWeight: typography.weight.bold, lineHeight: 25 },
    brandSubtitle: { color: colors.textSecondary, fontSize: typography.size.bodySmall, letterSpacing: 0.2 },
    profileButton: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
    menu: { backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderWidth: 1, borderRadius: borderRadius.md,
      padding: spacing.md, marginTop: -spacing.md, marginBottom: spacing.lg },
    menuName: { color: colors.textPrimary, fontSize: typography.size.body, fontWeight: typography.weight.semibold },
    menuSubtitle: { color: colors.textMuted, fontSize: typography.size.bodySmall, marginTop: spacing.xs },
    menuRule: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
    menuAction: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    menuActionText: { color: colors.textPrimary, fontSize: typography.size.body },
    error: { color: colors.danger, fontSize: typography.size.bodySmall, marginTop: spacing.sm },
    sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: spacing.sm, marginBottom: spacing.md },
    eyebrow: { color: colors.accentStrong, fontSize: typography.size.label, fontWeight: typography.weight.bold, letterSpacing: typography.letterSpacing.label, marginBottom: spacing.xs },
    sectionTitle: { color: colors.textPrimary, fontSize: 21, fontWeight: typography.weight.bold, lineHeight: 27 },
    feedHeading: { marginTop: spacing.xl },
    feedStatus: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.lg,
      padding: spacing.lg, alignItems: 'center', gap: spacing.sm },
    feedStatusText: { color: colors.textSecondary, fontSize: typography.size.body, lineHeight: 22, textAlign: 'center' },
    retryButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.md },
    retryText: { color: colors.accentStrong, fontSize: typography.size.body, fontWeight: typography.weight.bold },
    bottomNote: { color: colors.textMuted, fontSize: typography.size.bodySmall, textAlign: 'center', marginTop: spacing.lg },
  });
}

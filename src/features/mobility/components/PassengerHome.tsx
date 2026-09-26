import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { CarFront, LogOut, Repeat2, Route, UserRound, UsersRound } from 'lucide-react-native';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientFill } from '@/components/ui/GradientFill';
import { type AppTheme, useAppTheme } from '@/constants/theme';
import { useAuth } from '@/features/auth/context/AuthContext';
import { AgreedTripCard } from '@/features/mobility/components/AgreedTripCard';
import { PassengerAvatar } from '@/features/mobility/components/PassengerAvatar';
import { passengerHomeData } from '@/features/mobility/data/passenger-home.data';
import { useAgreedTrip } from '@/features/mobility/hooks/useAgreedTrip';
import { getOpenPublications, passengerSeats, publicationText, type PublicationTrip } from '@/features/mobility/services/publication.service';

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
    void getOpenPublications(controller.signal)
      .then((trips) => setPublications(trips))
      .catch(() => {
        if (!controller.signal.aborted) setPublicationsError('No fue posible cargar las publicaciones.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setPublicationsLoading(false);
      });
    return () => controller.abort();
  }, [reloadToken]));

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
              <Text style={styles.detailsLinkText}>Reintentar</Text>
            </Pressable>
          </View>
        ) : null}

        {publicationsLoading ? (
          <View style={styles.feedStatus}><ActivityIndicator color={theme.colors.accentStrong} /><Text style={styles.feedStatusText}>Cargando publicaciones…</Text></View>
        ) : publicationsError ? (
          <View style={styles.feedStatus}>
            <Text accessibilityRole="alert" style={styles.feedStatusText}>{publicationsError}</Text>
            <Pressable accessibilityRole="button" onPress={() => setReloadToken((value) => value + 1)} style={styles.retryButton}>
              <Text style={styles.detailsLinkText}>Reintentar</Text>
            </Pressable>
          </View>
        ) : publications.length === 0 ? (
          <View style={styles.feedStatus}><Text style={styles.feedStatusText}>Todavía no hay publicaciones abiertas con lugares disponibles.</Text></View>
        ) : publications.map((trip) => {
          const seats = passengerSeats(trip);
          return (
            <View key={trip.id} style={styles.feedCard}>
              <Text style={styles.description}>{publicationText(trip)}</Text>
              <View style={styles.priceBadge}>
                <Text style={styles.priceLabel}>APORTACIÓN TOTAL</Text>
                <Text style={styles.priceValue}>${trip.price}<Text style={styles.currency}> MXN</Text></Text>
              </View>
              <View style={styles.seatsHeader}>
                <View style={styles.seatsTitleRow}>
                  <CarFront size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.seatsTitle}>Asientos para pasajeros</Text>
                </View>
                <View style={styles.freeBadge}><Text style={styles.freeBadgeText}>{seats.available} libres</Text></View>
              </View>
              <Text style={styles.capacityText}>{seats.capacity} lugares para pasajeros en total</Text>
              <View style={styles.seatsRow} accessible accessibilityLabel={`${seats.occupied} asientos ocupados y ${seats.available} libres para pasajeros`}>
                {Array.from({ length: seats.capacity }, (_, index) => {
                  const occupied = index < seats.occupied;
                  return (
                    <View key={index} style={styles.seatItem}>
                      <View style={[styles.seatIcon, occupied ? styles.seatOccupied : styles.seatFree]}>
                        <UserRound size={21} strokeWidth={2.1} color={occupied ? theme.colors.textMuted : theme.colors.accentStrong} />
                        {occupied ? <View style={styles.seatSlash} /> : null}
                      </View>
                      <Text style={styles.seatCaption}>{occupied ? 'Ocup.' : 'Libre'}</Text>
                    </View>
                  );
                })}
              </View>
              <Pressable accessibilityRole="link" accessibilityLabel={`Ver detalles de la publicación desde ${trip.route.origin.name}`}
                onPress={() => router.push({ pathname: '/passenger/publicacion/[id]', params: { id: trip.id } })}
                style={({ pressed }) => [styles.detailsLink, pressed && styles.detailsLinkPressed]}>
                <Text style={styles.detailsLinkText}>Ver detalles</Text>
              </Pressable>
            </View>
          );
        })}
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
    feedCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.lg,
      padding: spacing.md, marginBottom: spacing.md },
    feedStatus: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.lg,
      padding: spacing.lg, alignItems: 'center', gap: spacing.sm },
    feedStatusText: { color: colors.textSecondary, fontSize: typography.size.body, lineHeight: 22, textAlign: 'center' },
    retryButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.md },
    priceBadge: { backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderWidth: 1, borderRadius: borderRadius.md,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm,
      paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
    priceLabel: { color: colors.textMuted, fontSize: 10, letterSpacing: 0.5, fontWeight: typography.weight.bold },
    priceValue: { color: colors.textPrimary, fontSize: 18, fontWeight: typography.weight.bold, marginTop: 2 },
    currency: { color: colors.textSecondary, fontSize: typography.size.label, fontWeight: typography.weight.regular },
    description: { color: colors.textSecondary, fontSize: typography.size.body, lineHeight: 23, marginBottom: spacing.md },
    seatsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg },
    seatsTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexShrink: 1 },
    seatsTitle: { color: colors.textPrimary, fontSize: typography.size.subtitle, fontWeight: typography.weight.semibold },
    freeBadge: { borderColor: colors.accentStrong, borderWidth: 1, borderRadius: borderRadius.full, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
    freeBadgeText: { color: colors.accentStrong, fontSize: typography.size.bodySmall, fontWeight: typography.weight.semibold },
    capacityText: { color: colors.textMuted, fontSize: typography.size.bodySmall, marginTop: spacing.xs },
    seatsRow: { flexDirection: 'row', alignSelf: 'flex-end', gap: spacing.sm, marginTop: spacing.md },
    seatItem: { alignItems: 'center', gap: spacing.xs },
    seatIcon: { width: 33, height: 37, borderRadius: borderRadius.sm, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    seatOccupied: { backgroundColor: colors.surfaceElevated, borderColor: colors.borderStrong },
    seatFree: { backgroundColor: colors.accentSoft, borderColor: colors.accentStrong, borderStyle: 'dashed' },
    seatSlash: { position: 'absolute', width: 29, height: 2, borderRadius: 1, backgroundColor: colors.textMuted, transform: [{ rotate: '-45deg' }] },
    seatCaption: { color: colors.textMuted, fontSize: typography.size.caption },
    detailsLink: { alignSelf: 'flex-end', minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.xs, marginTop: spacing.sm },
    detailsLinkPressed: { opacity: 0.65 },
    detailsLinkText: { color: colors.accentStrong, fontSize: typography.size.body, fontWeight: typography.weight.bold },
    bottomNote: { color: colors.textMuted, fontSize: typography.size.bodySmall, textAlign: 'center', marginTop: spacing.lg },
  });
}

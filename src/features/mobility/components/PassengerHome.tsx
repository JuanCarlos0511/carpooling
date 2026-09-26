import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { CarFront, LogOut, MapPin, Repeat2, Route, UserRound, UsersRound } from 'lucide-react-native';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientFill } from '@/components/ui/GradientFill';
import { type AppTheme, useAppTheme } from '@/constants/theme';
import { useAuth } from '@/features/auth/context/AuthContext';
import { passengerHomeData } from '@/features/mobility/data/passenger-home.data';
import { getOpenPublications, passengerSeats, publicationText, type PublicationTrip } from '@/features/mobility/services/publication.service';

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase();
}

function Avatar({ name, size = 52, theme, online = false }: { name: string; size?: number; theme: AppTheme; online?: boolean }) {
  return (
    <View style={{ width: size, height: size }}>
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: theme.colors.surfaceElevated,
        borderWidth: 1, borderColor: theme.colors.borderStrong, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: theme.colors.textPrimary, fontSize: size * 0.31, fontWeight: '700' }}>{initials(name)}</Text>
      </View>
      {online ? <View style={{ position: 'absolute', width: 14, height: 14, borderRadius: 7, right: 0, bottom: 0,
        backgroundColor: theme.colors.success, borderWidth: 2, borderColor: theme.colors.surface }} /> : null}
    </View>
  );
}

export function PassengerHome() {
  const theme = useAppTheme();
  const router = useRouter();
  const { user, logout, changeRole } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState<string>();
  const [publications, setPublications] = useState<PublicationTrip[]>([]);
  const [publicationsLoading, setPublicationsLoading] = useState(true);
  const [publicationsError, setPublicationsError] = useState<string>();
  const [reloadToken, setReloadToken] = useState(0);
  const styles = makeStyles(theme);
  const { brand, upcomingTrip } = passengerHomeData;
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
            <Avatar name={displayName} size={44} theme={theme} />
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

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.eyebrow}>TU PRÓXIMO VIAJE</Text>
            <Text style={styles.sectionTitle}>Todo listo para salir</Text>
          </View>
          <View style={styles.confirmedBadge}><View style={styles.confirmedDot} /><Text style={styles.confirmedText}>CONFIRMADO</Text></View>
        </View>

        <View style={styles.upcomingCard}>
          <View style={styles.upcomingMain}>
            <Avatar name={upcomingTrip.driver} size={60} theme={theme} />
            <View style={styles.driverDetails}>
              <Text style={styles.driverName} numberOfLines={1}>{upcomingTrip.driver}</Text>
              <Text style={styles.carText} numberOfLines={2}>{upcomingTrip.car}</Text>
            </View>
            <View style={styles.pinBlock}>
              <Text style={styles.pinLabel}>PIN</Text>
              <Text style={styles.pinValue}>{upcomingTrip.pin}</Text>
            </View>
          </View>
          <View style={styles.separator} />
          <View style={styles.meetingRow}>
            <MapPin size={19} color={theme.colors.accent} />
            <Text style={styles.meetingText}>Punto de encuentro: <Text style={styles.meetingStrong}>{upcomingTrip.meetingPoint}</Text></Text>
          </View>
          <Text style={styles.departureText}>{upcomingTrip.departure}</Text>
          <Pressable accessibilityRole="link" accessibilityLabel="Ver detalles de la ruta activa"
            onPress={() => router.push('/passenger/detalles')}
            style={({ pressed }) => [styles.tripDetailsLink, pressed && styles.tripDetailsLinkPressed]}>
            <Text style={styles.tripDetailsLinkText}>Ver detalles</Text>
          </Pressable>
        </View>

        <View style={[styles.sectionHeading, styles.feedHeading]}>
          <View>
            <Text style={styles.eyebrow}>PARA TI</Text>
            <Text style={styles.sectionTitle}>Viajes de la comunidad</Text>
          </View>
          <UsersRound size={21} color={theme.colors.textMuted} />
        </View>

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
                style={({ pressed }) => [styles.detailsLink, pressed && styles.tripDetailsLinkPressed]}>
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
    confirmedBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, borderWidth: 1, borderColor: colors.border,
      backgroundColor: colors.surface, borderRadius: borderRadius.full, paddingVertical: 7, paddingHorizontal: 9 },
    confirmedDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
    confirmedText: { color: colors.textSecondary, fontSize: 9, fontWeight: typography.weight.bold, letterSpacing: 0.6 },
    upcomingCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.lg, padding: spacing.md },
    upcomingMain: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    driverDetails: { flex: 1, minWidth: 0 },
    driverName: { color: colors.textPrimary, fontSize: typography.size.subtitle, fontWeight: typography.weight.bold },
    carText: { color: colors.textSecondary, fontSize: typography.size.bodySmall, marginTop: spacing.xs, lineHeight: 18 },
    pinBlock: { borderLeftWidth: 1, borderLeftColor: colors.border, paddingLeft: spacing.sm, alignItems: 'center' },
    pinLabel: { color: colors.textMuted, fontSize: typography.size.label, fontWeight: typography.weight.semibold, letterSpacing: typography.letterSpacing.label },
    pinValue: { color: colors.accentStrong, fontSize: 23, fontWeight: typography.weight.bold, letterSpacing: 2, marginTop: spacing.xs },
    separator: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
    meetingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    meetingText: { color: colors.textSecondary, fontSize: typography.size.bodySmall, flex: 1, lineHeight: 19 },
    meetingStrong: { color: colors.textPrimary, fontWeight: typography.weight.semibold },
    departureText: { color: colors.textMuted, fontSize: typography.size.bodySmall, marginLeft: 27, marginTop: spacing.xs },
    tripDetailsLink: { alignSelf: 'flex-end', minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.xs, marginTop: spacing.xs },
    tripDetailsLinkPressed: { opacity: 0.65 },
    tripDetailsLinkText: { color: colors.accentStrong, fontSize: typography.size.bodySmall, fontWeight: typography.weight.bold },
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
    detailsLinkText: { color: colors.accentStrong, fontSize: typography.size.body, fontWeight: typography.weight.bold },
    bottomNote: { color: colors.textMuted, fontSize: typography.size.bodySmall, textAlign: 'center', marginTop: spacing.lg },
  });
}

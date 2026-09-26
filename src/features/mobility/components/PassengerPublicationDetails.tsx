import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { CarFront, Clock3, MapPin, ShieldCheck, UserPlus, UserRound } from 'lucide-react-native';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientFill } from '@/components/ui/GradientFill';
import { type AppTheme, useAppTheme } from '@/constants/theme';
import { RouteMapCard } from '@/features/mobility/components/RouteMapCard';
import {
  formatDeparture, formatHour, getPublication, passengerSeats, publicationText, requestPublicationSeat,
  tripWaypoints, type PublicationTrip,
} from '@/features/mobility/services/publication.service';

export function PassengerPublicationDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const [trip, setTrip] = useState<PublicationTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>();
  const [reloadToken, setReloadToken] = useState(0);
  const [boardingStopId, setBoardingStopId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [requestError, setRequestError] = useState<string>();
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    setBoardingStopId(null);
    setRequestError(undefined);
    setRequested(false);
  }, [id]);

  useFocusEffect(useCallback(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError(undefined);
    if (id) {
      void getPublication(id, controller.signal)
        .then((publication) => setTrip(publication))
        .catch(() => {
          if (!controller.signal.aborted) setLoadError('No fue posible cargar esta publicación.');
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    } else {
      setLoadError('Falta el identificador de la publicación.');
      setLoading(false);
    }
    return () => controller.abort();
  }, [id, reloadToken]));

  async function requestSeat() {
    if (!trip || !boardingStopId || submitting) return;
    setSubmitting(true);
    setRequestError(undefined);
    try {
      await requestPublicationSeat(trip.id, boardingStopId);
      setRequested(true);
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'No fue posible enviar la solicitud.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <View style={styles.state}><ActivityIndicator color={theme.colors.accentStrong} /><Text style={styles.secondary}>Cargando publicación…</Text></View>
    </SafeAreaView>
  );

  if (loadError || !trip) return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <View style={styles.state}>
        <Text accessibilityRole="alert" style={styles.secondary}>{loadError ?? 'La publicación no está disponible.'}</Text>
        <Pressable accessibilityRole="button" onPress={() => setReloadToken((value) => value + 1)} style={styles.retryButton}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );

  const seats = passengerSeats(trip);
  const boardingStops = trip.stops.filter((stop) => stop.kind !== 'destination');
  const canRequest = trip.status === 'open' && seats.available > 0 && !requested;

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>PUBLICACIÓN DE VIAJE</Text>
        <Text accessibilityRole="header" style={styles.title}>{trip.route.origin.name} → {trip.route.destination.name}</Text>
        <Text style={styles.description}>{publicationText(trip)}</Text>

        <View style={styles.summaryCard}>
          <View style={styles.detailRow}><UserRound size={19} color={theme.colors.accentStrong} />
            <Text style={styles.detailText}>Conduce <Text style={styles.detailStrong}>{trip.driver.fullName}</Text></Text></View>
          <View style={styles.detailRow}><Clock3 size={19} color={theme.colors.accentStrong} />
            <Text style={styles.detailText}>Salida <Text style={styles.detailStrong}>{formatDeparture(trip.departureAt)}</Text></Text></View>
          <View style={styles.detailRow}><MapPin size={19} color={theme.colors.accentStrong} />
            <Text style={styles.detailText}>Llegada estimada <Text style={styles.detailStrong}>{formatHour(trip.arrivalAt)} hrs</Text></Text></View>
          <View style={styles.divider} />
          <View style={styles.metricRow}>
            <View><Text style={styles.metricLabel}>APORTACIÓN TOTAL</Text><Text style={styles.metricValue}>${trip.price} MXN</Text></View>
            <View style={styles.seatsMetric}><CarFront size={18} color={theme.colors.accentStrong} />
              <Text style={styles.seatsMetricText}>{seats.available} de {seats.capacity} libres</Text></View>
          </View>
          <Text style={styles.capacityNote}>Los lugares corresponden solo a pasajeros.</Text>
        </View>

        <Text style={styles.sectionTitle}>Recorrido</Text>
        <RouteMapCard departureTime={formatHour(trip.departureAt)} waypoints={tripWaypoints(trip)} />

        <Text style={styles.sectionTitle}>Paradas y horarios</Text>
        <View style={styles.stopsCard}>
          {trip.stops.map((stop, index) => (
            <View key={stop.id} style={[styles.stopRow, index > 0 && styles.stopBorder]}>
              <View style={styles.stopNumber}><Text style={styles.stopNumberText}>{index + 1}</Text></View>
              <View style={styles.stopText}><Text style={styles.stopName}>{stop.name}</Text>
                <Text style={styles.stopKind}>{stop.kind === 'origin' ? 'Salida' : stop.kind === 'destination' ? 'Destino' : 'Parada'}
                  {stop.completedAt ? ' · Completada' : ''}</Text></View>
              <Text style={styles.stopTime}>{formatHour(stop.scheduledAt)}</Text>
            </View>
          ))}
        </View>

        {canRequest ? (
          <>
            <Text style={styles.sectionTitle}>¿Dónde esperarás al conductor?</Text>
            <Text style={styles.secondary}>Elige el origen o una parada para enviar tu solicitud.</Text>
            <View style={styles.boardingOptions}>
              {boardingStops.map((stop) => {
                const selected = boardingStopId === stop.id;
                return (
                  <Pressable key={stop.id} accessibilityRole="radio" accessibilityState={{ selected }}
                    onPress={() => setBoardingStopId(stop.id)}
                    style={[styles.boardingOption, selected && styles.boardingOptionSelected]}>
                    <View style={[styles.radio, selected && styles.radioSelected]} />
                    <View style={styles.stopText}><Text style={styles.stopName}>{stop.name}</Text>
                      <Text style={styles.stopKind}>Pasa a las {formatHour(stop.scheduledAt)} hrs</Text></View>
                  </Pressable>
                );
              })}
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Pedir un lugar"
              accessibilityState={{ disabled: !boardingStopId || submitting }}
              disabled={!boardingStopId || submitting} onPress={() => void requestSeat()}
              style={({ pressed }) => [styles.requestButton, (!boardingStopId || submitting) && styles.requestButtonDisabled,
                pressed && styles.requestButtonPressed]}>
              {boardingStopId && !submitting ? <GradientFill dominantStart /> : null}
              {submitting ? <ActivityIndicator color={theme.colors.white} /> : <UserPlus size={20} color={boardingStopId ? theme.colors.white : theme.colors.disabledForeground} />}
              <Text style={[styles.requestButtonText, !boardingStopId && styles.requestButtonTextDisabled]}>
                {submitting ? 'Enviando solicitud…' : 'Pedir un lugar'}
              </Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.requestNotice}>
            <Text style={styles.requestNoticeText}>{requested ? 'Solicitud enviada. El conductor debe aceptarla.'
              : trip.status !== 'open' ? 'Esta publicación ya no recibe solicitudes.' : 'No quedan lugares disponibles.'}</Text>
          </View>
        )}
        {requestError ? <Text accessibilityRole="alert" style={styles.requestError}>{requestError}</Text> : null}
        <View style={styles.verified}><ShieldCheck size={17} color={theme.colors.textMuted} />
          <Text style={styles.verifiedText}>Comunidad universitaria verificada</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(theme: AppTheme) {
  const { colors, spacing, borderRadius, typography } = theme;
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { width: '100%', maxWidth: 620, alignSelf: 'center', padding: spacing.md, paddingBottom: spacing.xxl },
    state: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.lg },
    eyebrow: { color: colors.accentStrong, fontSize: typography.size.label, fontWeight: typography.weight.bold,
      letterSpacing: typography.letterSpacing.label, marginTop: spacing.sm },
    title: { color: colors.textPrimary, fontSize: typography.size.title, fontWeight: typography.weight.bold, lineHeight: 35, marginTop: spacing.xs },
    description: { color: colors.textSecondary, fontSize: typography.size.body, lineHeight: 23, marginTop: spacing.md, marginBottom: spacing.lg },
    summaryCard: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: borderRadius.lg, padding: spacing.md },
    detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.md },
    detailText: { color: colors.textSecondary, fontSize: typography.size.bodySmall, lineHeight: 19, flex: 1 },
    detailStrong: { color: colors.textPrimary, fontWeight: typography.weight.semibold },
    divider: { height: 1, backgroundColor: colors.border, marginBottom: spacing.md },
    metricRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
    metricLabel: { color: colors.textMuted, fontSize: typography.size.label, fontWeight: typography.weight.bold,
      letterSpacing: typography.letterSpacing.label },
    metricValue: { color: colors.textPrimary, fontSize: 22, fontWeight: typography.weight.bold, marginTop: spacing.xs },
    seatsMetric: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    seatsMetricText: { color: colors.accentStrong, fontSize: typography.size.bodySmall, fontWeight: typography.weight.semibold },
    capacityNote: { color: colors.textMuted, fontSize: typography.size.bodySmall, marginTop: spacing.sm },
    sectionTitle: { color: colors.textPrimary, fontSize: typography.size.subtitle, fontWeight: typography.weight.bold,
      marginTop: spacing.xl, marginBottom: spacing.md },
    stopsCard: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.md },
    stopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md },
    stopBorder: { borderTopColor: colors.border, borderTopWidth: 1 },
    stopNumber: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.accentSoft,
      alignItems: 'center', justifyContent: 'center' },
    stopNumberText: { color: colors.accentStrong, fontSize: typography.size.bodySmall, fontWeight: typography.weight.bold },
    stopText: { flex: 1 },
    stopName: { color: colors.textPrimary, fontSize: typography.size.body, fontWeight: typography.weight.semibold },
    stopKind: { color: colors.textMuted, fontSize: typography.size.bodySmall, marginTop: spacing.xs },
    stopTime: { color: colors.textPrimary, fontSize: typography.size.bodySmall, fontWeight: typography.weight.semibold },
    secondary: { color: colors.textSecondary, fontSize: typography.size.body, lineHeight: 21 },
    retryButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.md },
    retryText: { color: colors.accentStrong, fontSize: typography.size.body, fontWeight: typography.weight.bold },
    boardingOptions: { gap: spacing.sm, marginTop: spacing.md },
    boardingOption: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 58,
      padding: spacing.md, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: borderRadius.md },
    boardingOptionSelected: { borderColor: colors.accentStrong, backgroundColor: colors.accentSoft },
    radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.borderStrong },
    radioSelected: { borderColor: colors.accentStrong, backgroundColor: colors.accentStrong },
    requestButton: { minHeight: 52, marginTop: spacing.lg, borderRadius: borderRadius.md, backgroundColor: colors.accent,
      overflow: 'hidden', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
    requestButtonPressed: { opacity: 0.82 },
    requestButtonDisabled: { backgroundColor: colors.disabledBackground },
    requestButtonText: { color: colors.white, fontSize: typography.size.body, fontWeight: typography.weight.bold },
    requestButtonTextDisabled: { color: colors.disabledForeground },
    requestNotice: { backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderWidth: 1,
      borderRadius: borderRadius.md, padding: spacing.md, marginTop: spacing.lg },
    requestNoticeText: { color: colors.textSecondary, fontSize: typography.size.body, lineHeight: 21 },
    requestError: { color: colors.danger, fontSize: typography.size.bodySmall, marginTop: spacing.sm },
    verified: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl },
    verifiedText: { color: colors.textMuted, fontSize: typography.size.bodySmall },
  });
}

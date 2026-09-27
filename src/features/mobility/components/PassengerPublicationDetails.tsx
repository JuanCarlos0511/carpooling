import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Info, Repeat2, ShieldCheck, UserPlus, XCircle } from 'lucide-react-native';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type AppTheme, useAppTheme } from '@/constants/theme';
import { useAuth } from '@/features/auth/context/AuthContext';
import { PublicationAuthor } from '@/features/mobility/components/PublicationAuthor';
import { PublicationSummaryCard } from '@/features/mobility/components/PublicationSummaryCard';
import { RouteMapCard } from '@/features/mobility/components/RouteMapCard';
import {
  cancelPublicationRequest, changePublicationBoardingStop, formatDeparture, formatHour, getPublication,
  getPublicationRequest, passengerSeats, publicationText, requestPublicationSeat, tripWaypoints,
  type PublicationRequest, type PublicationTrip,
} from '@/features/mobility/services/publication.service';

export function PassengerPublicationDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { accessToken } = useAuth();
  const [trip, setTrip] = useState<PublicationTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>();
  const [reloadToken, setReloadToken] = useState(0);
  const [boardingStopId, setBoardingStopId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [requestError, setRequestError] = useState<string>();
  const [currentRequest, setCurrentRequest] = useState<PublicationRequest | null>(null);
  const [clock, setClock] = useState(Date.now());

  useEffect(() => {
    setBoardingStopId(null);
    setRequestError(undefined);
    setCurrentRequest(null);
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useFocusEffect(useCallback(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError(undefined);
    if (id && accessToken) {
      void Promise.all([
        getPublication(id, controller.signal),
        getPublicationRequest(id, accessToken, controller.signal),
      ])
        .then(([publication, ownRequest]) => {
          if (controller.signal.aborted) return;
          setTrip(publication);
          setCurrentRequest(ownRequest);
          setBoardingStopId(ownRequest && publication.stops.some((stop) => stop.id === ownRequest.boardingStopId && stop.kind === 'stop')
            ? ownRequest.boardingStopId : null);
          setClock(Date.now());
        })
        .catch(() => {
          if (!controller.signal.aborted) setLoadError('No fue posible cargar la publicación o consultar tu solicitud.');
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    } else {
      setLoadError(id ? 'Inicia sesión para consultar tus solicitudes.' : 'Falta el identificador de la publicación.');
      setLoading(false);
    }
    return () => controller.abort();
  }, [id, accessToken, reloadToken]));

  async function requestSeat() {
    if (!trip || !boardingStopId || !accessToken || submitting || cancelling) return;
    if (currentRequest?.status === 'cancelled' && Date.now() < new Date(currentRequest.updatedAt).getTime() + 10_000) return;
    if (currentRequest && !['pending', 'accepted', 'cancelled'].includes(currentRequest.status)) return;
    setSubmitting(true);
    setRequestError(undefined);
    try {
      const updated = currentRequest && ['pending', 'accepted'].includes(currentRequest.status)
        ? await changePublicationBoardingStop(trip.id, boardingStopId, accessToken)
        : await requestPublicationSeat(trip.id, boardingStopId, accessToken);
      setCurrentRequest(updated);
    } catch (error) {
      try {
        const savedRequest = await getPublicationRequest(trip.id, accessToken);
        if (savedRequest && (savedRequest.status !== currentRequest?.status || savedRequest.boardingStopId !== currentRequest?.boardingStopId)) {
          setCurrentRequest(savedRequest);
          setBoardingStopId(savedRequest.boardingStopId);
          return;
        }
      } catch { /* Conserva el error original de envío. */ }
      setRequestError(error instanceof Error ? error.message : 'No fue posible enviar la solicitud.');
    } finally {
      setSubmitting(false);
    }
  }

  async function cancelRequest() {
    if (!trip || !accessToken || !currentRequest || cancelling || submitting) return;
    setCancelling(true);
    setRequestError(undefined);
    try {
      const cancelled = await cancelPublicationRequest(trip.id, accessToken);
      setCurrentRequest(cancelled);
      setClock(Date.now());
      void getPublication(trip.id).then(setTrip).catch(() => {});
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'No fue posible cancelar la solicitud.');
    } finally {
      setCancelling(false);
    }
  }

  function confirmCancellation() {
    Alert.alert('Cancelar solicitud', '¿Seguro que quieres cancelar tu solicitud para este viaje?', [
      { text: 'Volver', style: 'cancel' },
      { text: 'Sí, cancelar', style: 'destructive', onPress: () => void cancelRequest() },
    ]);
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
  const boardingStops = trip.stops.filter((stop) => stop.kind === 'stop');
  const destination = trip.stops.find((stop) => stop.kind === 'destination');
  const requestStatus = currentRequest?.status ?? null;
  const activeRequest = requestStatus === 'pending' || requestStatus === 'accepted';
  const tripEditable = ['open', 'closed'].includes(trip.status) && new Date(trip.departureAt).getTime() > clock;
  const canCreate = trip.status === 'open' && seats.available > 0 && boardingStops.length > 0
    && (!currentRequest || requestStatus === 'cancelled');
  const canChange = activeRequest && tripEditable;
  const canSelect = canCreate || canChange;
  const canCancel = activeRequest && tripEditable;
  const cooldownSeconds = currentRequest?.status === 'cancelled'
    ? Math.max(0, Math.ceil((new Date(currentRequest.updatedAt).getTime() + 10_000 - clock) / 1000)) : 0;
  const actionDisabled = !boardingStopId || submitting || cancelling || cooldownSeconds > 0
    || (canChange && boardingStopId === currentRequest?.boardingStopId);
  const actionForeground = theme.dark ? theme.colors.background : theme.colors.primaryForeground;
  const actionLabel = canChange ? 'Cambiar tu parada' : requestStatus === 'cancelled' ? 'Volver a solicitar lugar' : 'Pedir un lugar';
  const requestNotice = requestStatus === 'pending' ? 'Solicitud enviada. El conductor debe aceptarla.'
    : requestStatus === 'accepted' ? 'Tu solicitud fue aceptada. Puedes cambiar tu parada antes de que inicie el viaje.'
      : requestStatus === 'rejected' ? 'Tu solicitud fue rechazada.'
        : requestStatus === 'completed' ? 'Tu participación en este viaje ya finalizó.'
          : requestStatus === 'cancelled' ? trip.status !== 'open' || seats.available === 0
            ? 'Solicitud cancelada. Esta publicación ya no recibe solicitudes.'
            : cooldownSeconds > 0 ? `Solicitud cancelada. Podrás volver a enviarla en ${cooldownSeconds} s.`
              : 'Solicitud cancelada. Puedes volver a solicitar lugar.'
            : trip.status !== 'open' ? 'Esta publicación ya no recibe solicitudes.'
              : boardingStops.length === 0 ? 'No hay paradas públicas disponibles para solicitar lugar.'
                : seats.available === 0 ? 'No quedan lugares disponibles.' : null;

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.publicationCard}>
          <View style={styles.publicationAuthor}><PublicationAuthor driver={trip.driver} /></View>
          <Text style={styles.description}>{publicationText(trip)}</Text>
          <PublicationSummaryCard trip={trip} />
        </View>

        <Text style={styles.sectionTitle}>Recorrido</Text>
        <RouteMapCard firstStopTime={boardingStops[0] ? formatHour(boardingStops[0].scheduledAt) : undefined} waypoints={tripWaypoints(trip)} />

        <Text style={styles.sectionTitle}>Paradas y horarios</Text>
        {canSelect ? <Text style={styles.secondary}>Selecciona la parada donde esperarás al conductor.</Text> : null}
        <View style={styles.stopsCard}>
          {boardingStops.map((stop, index) => {
            const selected = boardingStopId === stop.id;
            return (
              <Pressable key={stop.id} accessibilityRole={canSelect ? 'radio' : undefined}
                accessibilityState={canSelect ? { selected } : undefined} disabled={!canSelect}
                onPress={() => setBoardingStopId(stop.id)}
                style={[styles.stopRow, selected && canSelect && styles.stopRowSelected]}>
                <View style={styles.stopNumber}><Text style={styles.stopNumberText}>{index + 1}</Text></View>
                <View style={styles.stopText}><Text style={styles.stopName}>{stop.name}</Text>
                  <Text style={styles.stopKind}>Parada {index + 1}{stop.completedAt ? ' · Completada' : ''}</Text></View>
                <Text style={styles.stopTime}>{formatHour(stop.scheduledAt)}</Text>
                {canSelect ? <View style={[styles.radio, selected && styles.radioSelected]} /> : null}
              </Pressable>
            );
          })}
        </View>
        {destination ? (
          <>
            <View style={styles.destinationDivider} />
            <View style={styles.destinationCard}>
              <View style={styles.stopNumber}><Text style={styles.stopNumberText}>D</Text></View>
              <View style={styles.stopText}><Text style={styles.stopName}>{destination.name}</Text>
                <Text style={styles.stopKind}>Destino · No es punto de abordaje</Text></View>
              <Text style={styles.stopTime}>{formatHour(destination.scheduledAt)}</Text>
            </View>
          </>
        ) : null}
        {requestNotice ? <View style={styles.requestNotice}>
          <Info size={18} color={theme.colors.accentStrong} />
          <Text style={styles.requestNoticeText}>{requestNotice}</Text>
        </View> : null}
        {canSelect ? (
            <Pressable accessibilityRole="button" accessibilityLabel={actionLabel}
              accessibilityState={{ disabled: actionDisabled }}
              disabled={actionDisabled} onPress={() => void requestSeat()}
              style={({ pressed }) => [styles.requestButton, actionDisabled && styles.requestButtonDisabled,
                pressed && styles.requestButtonPressed]}>
              {submitting ? <ActivityIndicator color={actionForeground} /> : canChange
                ? <Repeat2 size={20} color={actionDisabled ? theme.colors.neutralDisabledForeground : actionForeground} />
                : <UserPlus size={20} color={actionDisabled ? theme.colors.neutralDisabledForeground : actionForeground} />}
              <Text style={[styles.requestButtonText, actionDisabled && styles.requestButtonTextDisabled]}>
                {submitting ? 'Guardando…' : cooldownSeconds > 0 ? `Espera ${cooldownSeconds} s` : actionLabel}
              </Text>
            </Pressable>
        ) : null}
        {canCancel ? (
          <Pressable accessibilityRole="button" disabled={submitting || cancelling} onPress={confirmCancellation} style={styles.cancelButton}>
            {cancelling ? <ActivityIndicator size="small" color={theme.colors.textSecondary} />
              : <XCircle size={17} color={theme.colors.textSecondary} />}
            <Text style={styles.cancelButtonText}>{cancelling ? 'Cancelando…' : 'Cancelar solicitud'}</Text>
          </Pressable>
        ) : null}
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
    publicationCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
      borderRadius: borderRadius.lg, padding: spacing.md },
    publicationAuthor: { marginBottom: spacing.md },
    state: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.lg },
    description: { color: colors.textSecondary, fontSize: typography.size.body, lineHeight: 23, marginBottom: spacing.md },
    sectionTitle: { color: colors.textPrimary, fontSize: typography.size.subtitle, fontWeight: typography.weight.bold,
      marginTop: spacing.xl, marginBottom: spacing.md },
    stopsCard: { gap: spacing.sm, marginTop: spacing.sm },
    stopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 66, padding: spacing.md,
      backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: borderRadius.lg },
    stopRowSelected: { borderColor: colors.accentStrong, backgroundColor: colors.accentSoft },
    destinationDivider: { height: 1, backgroundColor: colors.borderStrong,
      marginHorizontal: spacing.md, marginTop: spacing.md, marginBottom: spacing.xs },
    destinationCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 66, padding: spacing.md,
      marginTop: spacing.xs, backgroundColor: colors.surface, borderColor: colors.border,
      borderWidth: 1, borderRadius: borderRadius.lg },
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
    radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.borderStrong },
    radioSelected: { borderColor: colors.accentStrong, backgroundColor: colors.accentStrong },
    requestButton: { minHeight: 52, marginTop: spacing.lg, borderRadius: borderRadius.md, backgroundColor: colors.accent,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
    requestButtonPressed: { opacity: 0.82 },
    requestButtonDisabled: { backgroundColor: colors.neutralDisabledBackground,
      borderColor: colors.neutralDisabledBorder, borderWidth: 1 },
    requestButtonText: { color: theme.dark ? colors.background : colors.primaryForeground,
      fontSize: typography.size.body, fontWeight: typography.weight.bold },
    requestButtonTextDisabled: { color: colors.neutralDisabledForeground },
    cancelButton: { minHeight: 44, marginTop: spacing.xs, paddingHorizontal: spacing.sm,
      alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
    cancelButtonText: { color: colors.textSecondary, fontSize: typography.size.bodySmall, fontWeight: typography.weight.semibold },
    requestNotice: { backgroundColor: colors.accentSoft, borderColor: colors.border, borderWidth: 1,
      borderRadius: borderRadius.md, padding: spacing.md, marginTop: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    requestNoticeText: { color: colors.textSecondary, fontSize: typography.size.bodySmall, lineHeight: 19, flex: 1 },
    requestError: { color: colors.danger, fontSize: typography.size.bodySmall, marginTop: spacing.sm },
    verified: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl },
    verifiedText: { color: colors.textMuted, fontSize: typography.size.bodySmall },
  });
}

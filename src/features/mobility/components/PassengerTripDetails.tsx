import { Clock3, MapPin, Route, ShieldCheck, TicketCheck, UserRound } from 'lucide-react-native';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type AppTheme, useAppTheme } from '@/constants/theme';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useAgreedTrip } from '@/features/mobility/hooks/useAgreedTrip';
import { formatDeparture } from '@/features/mobility/services/publication.service';

export function PassengerTripDetails() {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { accessToken } = useAuth();
  const { trip, loading, error, retry } = useAgreedTrip(accessToken);

  if (loading) return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.state}><ActivityIndicator color={theme.colors.accentStrong} /><Text style={styles.intro}>Cargando viaje…</Text></View>
    </SafeAreaView>
  );

  if (error || !trip) return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.state}>
        <Text accessibilityRole={error ? 'alert' : undefined} style={styles.intro}>
          {error ?? 'Aún no tienes un viaje acordado.'}
        </Text>
        {error ? <Pressable accessibilityRole="button" onPress={retry} style={styles.retryButton}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable> : null}
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>VIAJE CONFIRMADO</Text>
        <Text accessibilityRole="header" style={styles.title}>Detalles de Viaje</Text>
        <Text style={styles.intro}>Consulta los datos para encontrarte con tu conductor.</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <UserRound size={20} color={theme.colors.accentStrong} />
            <View style={styles.rowText}><Text style={styles.label}>Conductor</Text><Text style={styles.value}>{trip.trip.driver.fullName}</Text></View>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Route size={20} color={theme.colors.accentStrong} />
            <View style={styles.rowText}><Text style={styles.label}>Ruta</Text><Text style={styles.value}>
              {trip.trip.route.origin.name} → {trip.trip.route.destination.name}
            </Text></View>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Clock3 size={20} color={theme.colors.accentStrong} />
            <View style={styles.rowText}><Text style={styles.label}>Hora de encuentro</Text>
              <Text style={styles.value}>{formatDeparture(trip.boardingStop.scheduledAt)}</Text></View>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <MapPin size={20} color={theme.colors.accentStrong} />
            <View style={styles.rowText}><Text style={styles.label}>Punto de encuentro</Text><Text style={styles.value}>{trip.boardingStop.name}</Text></View>
          </View>
        </View>

        <View style={styles.pinCard}>
          <TicketCheck size={23} color={theme.colors.accentStrong} />
          <View style={styles.pinText}><Text style={styles.label}>PIN de abordaje</Text>
            <Text style={styles.pin}>{trip.boardingPin ?? 'Pendiente'}</Text></View>
        </View>
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
    state: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.md },
    retryButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.md },
    retryText: { color: colors.accentStrong, fontSize: typography.size.body, fontWeight: typography.weight.bold },
    eyebrow: { color: colors.accentStrong, fontSize: typography.size.label, fontWeight: typography.weight.bold,
      letterSpacing: typography.letterSpacing.label, marginTop: spacing.md },
    title: { color: colors.textPrimary, fontSize: typography.size.title, fontWeight: typography.weight.bold, marginTop: spacing.xs },
    intro: { color: colors.textSecondary, fontSize: typography.size.body, lineHeight: 22, marginTop: spacing.sm, marginBottom: spacing.lg },
    card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: borderRadius.lg, padding: spacing.md },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 56 },
    rowText: { flex: 1 },
    label: { color: colors.textMuted, fontSize: typography.size.bodySmall },
    value: { color: colors.textPrimary, fontSize: typography.size.body, fontWeight: typography.weight.semibold, marginTop: spacing.xs },
    divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
    pinCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surfaceElevated,
      borderColor: colors.border, borderWidth: 1, borderRadius: borderRadius.lg, padding: spacing.md, marginTop: spacing.md },
    pinText: { flex: 1 },
    pin: { color: colors.accentStrong, fontSize: 28, fontWeight: typography.weight.bold, letterSpacing: 3, marginTop: spacing.xs },
    verified: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg },
    verifiedText: { color: colors.textMuted, fontSize: typography.size.bodySmall },
  });
}

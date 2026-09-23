import { Navigation2 } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { type AppTheme, useAppTheme } from '@/constants/theme';
import type { TripWaypoint } from '@/features/mobility/data/passenger-home.data';
import { usePlannedRoute } from '@/features/mobility/hooks/usePlannedRoute';
import { RouteMap } from '@/features/mobility/components/RouteMap';

type Props = {
  departureTime: string;
  waypoints: readonly TripWaypoint[];
};

export function RouteMapCard({ departureTime, waypoints }: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { route, status } = usePlannedRoute(waypoints.map((point) => point.coordinate));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Navigation2 size={17} color={theme.colors.accentStrong} />
          <Text style={styles.title}>RUTA PLANEADA</Text>
        </View>
        <Text style={styles.departure}>Salida {departureTime} hrs</Text>
      </View>
      <View style={styles.mapContainer}>
        <RouteMap waypoints={waypoints} routeGeometry={route?.geometry ?? null} />
        {status === 'loading' ? (
          <View style={styles.statusPill}>
            <ActivityIndicator size="small" color={theme.colors.accentStrong} />
            <Text style={styles.statusText}>Trazando ruta…</Text>
          </View>
        ) : null}
        {status === 'error' ? (
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>No se pudo cargar el trayecto por calles</Text>
          </View>
        ) : null}
        {route ? (
          <View style={styles.routeSummary}>
            <View style={styles.summaryDot} />
            <View>
              <Text style={styles.summaryTime}>{route.durationMinutes} min</Text>
              <Text style={styles.summaryDistance}>{route.distanceKm.toFixed(1)} km por carretera</Text>
            </View>
          </View>
        ) : null}
      </View>
      <View style={styles.stops}>
        {waypoints.map((point, index) => (
          <View key={point.id} style={[styles.stop, index === 1 ? styles.stopMiddle : null,
            index === waypoints.length - 1 ? styles.stopLast : null]}>
            <Text style={[styles.stopKind, index === 0 ? styles.originText : null,
              index === waypoints.length - 1 ? styles.destinationText : null]} numberOfLines={1}>{point.detail}</Text>
            <Text style={styles.stopName} numberOfLines={2}>{point.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function makeStyles(theme: AppTheme) {
  const { colors, spacing, borderRadius, typography } = theme;
  return StyleSheet.create({
    card: { borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.lg, overflow: 'hidden', backgroundColor: colors.surfaceElevated },
    header: { minHeight: 56, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
    headerTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexShrink: 1 },
    title: { color: colors.textPrimary, fontSize: typography.size.bodySmall, fontWeight: typography.weight.bold, letterSpacing: 0.6 },
    departure: { color: colors.textSecondary, fontSize: typography.size.bodySmall },
    mapContainer: { height: 250, backgroundColor: '#171C25', overflow: 'hidden' },
    statusPill: { position: 'absolute', left: spacing.sm, top: spacing.sm, maxWidth: '64%', alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center',
      gap: spacing.sm, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: borderRadius.sm,
      paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
    statusText: { color: colors.textSecondary, fontSize: typography.size.bodySmall, flexShrink: 1 },
    routeSummary: { position: 'absolute', top: spacing.sm, right: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
      backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: borderRadius.md,
      paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
    summaryDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success },
    summaryTime: { color: colors.textPrimary, fontSize: typography.size.bodySmall, fontWeight: typography.weight.bold },
    summaryDistance: { color: colors.textMuted, fontSize: typography.size.caption, marginTop: 1 },
    stops: { flexDirection: 'row', backgroundColor: colors.surface, padding: spacing.md, gap: spacing.sm },
    stop: { flex: 1, minWidth: 0 },
    stopMiddle: { alignItems: 'center' },
    stopLast: { alignItems: 'flex-end' },
    stopKind: { color: colors.textSecondary, fontSize: typography.size.bodySmall, fontWeight: typography.weight.semibold, marginBottom: spacing.xs },
    originText: { color: colors.accentStrong },
    destinationText: { color: colors.primary },
    stopName: { color: colors.textSecondary, fontSize: typography.size.bodySmall, lineHeight: 17 },
  });
}

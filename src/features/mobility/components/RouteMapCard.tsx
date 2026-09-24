import { useState } from 'react';
import { Maximize2, Minimize2, Navigation2, RotateCcw } from 'lucide-react-native';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type AppTheme, useAppTheme } from '@/constants/theme';
import type { TripWaypoint } from '@/features/mobility/data/passenger-home.data';
import { usePlannedRoute } from '@/features/mobility/hooks/usePlannedRoute';
import { RouteMap } from '@/features/mobility/components/RouteMap';

type Props = {
  departureTime: string;
  waypoints: readonly TripWaypoint[];
};

export function RouteMapCard({ departureTime, waypoints }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [selectedWaypointId, setSelectedWaypointId] = useState<string | null>(null);
  const [resetViewToken, setResetViewToken] = useState(0);
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { route, status } = usePlannedRoute(waypoints.map((point) => point.coordinate));
  const closeMap = () => {
    setExpanded(false);
    setSelectedWaypointId(null);
  };
  const resetMap = () => {
    setSelectedWaypointId(null);
    setResetViewToken((current) => current + 1);
  };

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
        <RouteMap waypoints={waypoints} routeGeometry={route?.geometry ?? null}
          resetViewToken={resetViewToken}
          onMapPress={() => setExpanded(true)}
          onWaypointPress={(id) => { setSelectedWaypointId(id); setExpanded(true); }} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ampliar mapa de la ruta"
          onPress={() => setExpanded(true)}
          style={styles.expandTarget}
        >
          <View style={styles.expandHint}>
            <Maximize2 size={15} color={theme.colors.white} />
            <Text style={styles.expandText}>Toca para ampliar</Text>
          </View>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Volver al centro de Tampico"
          onPress={resetMap} style={[styles.resetButton, styles.compactResetButton]}>
          <RotateCcw size={20} color={theme.colors.textPrimary} />
        </Pressable>
        {status === 'loading' ? (
          <View style={styles.statusPill} pointerEvents="none">
            <ActivityIndicator size="small" color={theme.colors.accentStrong} />
            <Text style={styles.statusText}>Trazando ruta…</Text>
          </View>
        ) : null}
        {status === 'error' ? (
          <View style={styles.statusPill} pointerEvents="none">
            <Text style={styles.statusText}>No se pudo cargar el trayecto por calles</Text>
          </View>
        ) : null}
        {route ? (
          <View style={styles.routeSummary} pointerEvents="none">
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
      <Modal visible={expanded} animationType="slide" onRequestClose={closeMap}>
        <View style={styles.fullscreen}>
          <RouteMap waypoints={waypoints} routeGeometry={route?.geometry ?? null} expanded
            resetViewToken={resetViewToken}
            selectedWaypointId={selectedWaypointId}
            onWaypointPress={(id) => setSelectedWaypointId((current) => current === id ? null : id)} />
          <SafeAreaView style={styles.fullscreenOverlay} pointerEvents="box-none">
            <View style={styles.fullscreenHeader}>
              <View style={styles.fullscreenTitleBlock}>
                <Text style={styles.fullscreenEyebrow}>RUTA PLANEADA</Text>
                <Text style={styles.fullscreenTitle} numberOfLines={1}>
                  {waypoints[0]?.name} → {waypoints[waypoints.length - 1]?.name}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Minimizar mapa"
                onPress={closeMap}
                style={styles.minimizeButton}
              >
                <Minimize2 size={21} color={theme.colors.textPrimary} />
              </Pressable>
            </View>
            <View style={styles.fullscreenSpacer} pointerEvents="none" />
            <Pressable accessibilityRole="button" accessibilityLabel="Volver al centro de Tampico"
              onPress={resetMap} style={[styles.resetButton, styles.fullscreenResetButton]}>
              <RotateCcw size={21} color={theme.colors.textPrimary} />
            </Pressable>
            <View style={styles.fullscreenFooter}>
              <Text style={styles.fullscreenRoute} numberOfLines={2}>
                {waypoints.map((point) => point.name).join('  →  ')}
              </Text>
              <Text style={styles.fullscreenHelp}>Toca una parada para ver su hora y estado. Arrastra o pellizca para explorar.</Text>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
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
    expandTarget: { position: 'absolute', left: spacing.sm, bottom: spacing.sm },
    expandHint: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: 'rgba(16, 17, 20, 0.86)', borderRadius: borderRadius.sm,
      paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
    expandText: { color: colors.white, fontSize: typography.size.bodySmall, fontWeight: typography.weight.semibold },
    resetButton: { width: 44, height: 44, borderRadius: borderRadius.md, backgroundColor: colors.surface,
      borderColor: colors.border, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    compactResetButton: { position: 'absolute', right: spacing.sm, bottom: spacing.sm },
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
    fullscreen: { flex: 1, backgroundColor: colors.background },
    fullscreenOverlay: { ...StyleSheet.absoluteFill, justifyContent: 'space-between' },
    fullscreenHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, margin: spacing.md, padding: spacing.sm,
      borderRadius: borderRadius.lg, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
    fullscreenTitleBlock: { flex: 1, minWidth: 0 },
    fullscreenEyebrow: { color: colors.accentStrong, fontSize: typography.size.label, fontWeight: typography.weight.bold,
      letterSpacing: typography.letterSpacing.label },
    fullscreenTitle: { color: colors.textPrimary, fontSize: typography.size.subtitle, fontWeight: typography.weight.bold, marginTop: 3 },
    minimizeButton: { width: 46, height: 46, borderRadius: borderRadius.md, backgroundColor: colors.surfaceElevated,
      borderColor: colors.border, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    fullscreenSpacer: { flex: 1 },
    fullscreenResetButton: { alignSelf: 'flex-end', marginHorizontal: spacing.md },
    fullscreenFooter: { margin: spacing.md, padding: spacing.md, borderRadius: borderRadius.lg, backgroundColor: colors.surface,
      borderColor: colors.border, borderWidth: 1 },
    fullscreenRoute: { color: colors.textPrimary, fontSize: typography.size.bodySmall, fontWeight: typography.weight.semibold },
    fullscreenHelp: { color: colors.textSecondary, fontSize: typography.size.bodySmall, marginTop: spacing.xs },
  });
}

import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { useAppTheme } from '@/constants/theme';
import type { Coordinate, TripWaypoint } from '@/features/mobility/data/passenger-home.data';
import type { RouteGeometry } from '@/features/mobility/services/route.service';

export function RouteMapFallback({ waypoints, routeGeometry }: { waypoints: readonly TripWaypoint[]; routeGeometry: RouteGeometry | null }) {
  const theme = useAppTheme();
  const routeColor = theme.dark ? theme.colors.accent : theme.colors.primary;
  const points = routeGeometry?.coordinates ?? waypoints.map((point) => point.coordinate);
  const longitudes = points.map(([longitude]) => longitude);
  const latitudes = points.map(([, latitude]) => latitude);
  const west = Math.min(...longitudes);
  const east = Math.max(...longitudes);
  const south = Math.min(...latitudes);
  const north = Math.max(...latitudes);
  const project = ([longitude, latitude]: Coordinate) => ({
    x: 32 + (longitude - west) / Math.max(east - west, 0.001) * 336,
    y: 27 + (north - latitude) / Math.max(north - south, 0.001) * 196,
  });
  const routePath = points.map((point, index) => {
    const { x, y } = project(point);
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice">
        <Rect width="400" height="250" fill="#171C25" />
        <Path d="M0 36 H400 M0 98 H400 M0 168 H400 M0 215 H400 M44 0 V250 M126 0 V250 M223 0 V250 M321 0 V250"
          stroke="#252C37" strokeWidth="10" />
        <Path d="M0 36 H400 M0 98 H400 M0 168 H400 M0 215 H400 M44 0 V250 M126 0 V250 M223 0 V250 M321 0 V250"
          stroke="#303A49" strokeWidth="1" />
        <Path d="M-10 198 L417 18 M-10 224 L412 42 M95 -10 L326 261" stroke="#39465A" strokeWidth="7" />
        <Path d={routePath}
          stroke="#101114" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Path d={routePath}
          stroke={routeColor} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {waypoints.map((point, index) => {
          const { x, y } = project(point.coordinate);
          return <Circle key={point.id} cx={x} cy={y} r={index === waypoints.length - 1 ? 12 : 9}
            fill={index === 0 ? routeColor : theme.colors.primary} stroke="#FFFFFF" strokeWidth="3" />;
        })}
      </Svg>
      <View style={styles.label}><Text style={styles.labelText}>Vista previa del trayecto</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#171C25' },
  label: { position: 'absolute', left: 8, top: 8, borderRadius: 6, backgroundColor: 'rgba(16, 17, 20, 0.84)', paddingHorizontal: 7, paddingVertical: 4 },
  labelText: { color: '#FFFFFF', fontSize: 10 },
});

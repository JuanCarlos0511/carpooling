import Constants from 'expo-constants';
import { View } from 'react-native';

import { useAppTheme } from '@/constants/theme';
import type { TripWaypoint } from '@/features/mobility/data/passenger-home.data';
import type { RouteGeometry } from '@/features/mobility/services/route.service';
import { RouteMapFallback } from '@/features/mobility/components/RouteMapFallback';

type Props = { waypoints: readonly TripWaypoint[]; routeGeometry: RouteGeometry | null };

export function RouteMap({ waypoints, routeGeometry }: Props) {
  const theme = useAppTheme();

  // Expo Go has no MapLibre native module. A development/production build renders the real map.
  if (Constants.appOwnership === 'expo') return <RouteMapFallback waypoints={waypoints} routeGeometry={routeGeometry} />;

  const MapLibre = require('@maplibre/maplibre-react-native') as typeof import('@maplibre/maplibre-react-native');
  const coordinates = waypoints.map((point) => point.coordinate);
  const longitudes = coordinates.map((point) => point[0]);
  const latitudes = coordinates.map((point) => point[1]);
  const bounds: [number, number, number, number] = [
    Math.min(...longitudes) - 0.006,
    Math.min(...latitudes) - 0.006,
    Math.max(...longitudes) + 0.006,
    Math.max(...latitudes) + 0.006,
  ];
  const lineColor = theme.dark ? theme.colors.accent : theme.colors.primary;

  return (
    <MapLibre.Map mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      style={{ flex: 1 }} logo={false} attribution attributionPosition={{ bottom: 4, right: 4 }}
      compass={false} dragPan touchZoom doubleTapZoom touchRotate={false} touchPitch={false}>
      <MapLibre.Camera initialViewState={{ bounds, padding: { top: 20, right: 24, bottom: 20, left: 24 } }} />
      {routeGeometry ? (
        <MapLibre.GeoJSONSource id="passenger-route" data={routeGeometry}>
          <MapLibre.Layer id="passenger-route-outline" type="line" paint={{ 'line-color': '#12141A', 'line-width': 10, 'line-opacity': 0.9 }}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }} />
          <MapLibre.Layer id="passenger-route-line" type="line" paint={{ 'line-color': lineColor, 'line-width': 5, 'line-opacity': 0.95 }}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }} />
        </MapLibre.GeoJSONSource>
      ) : null}
      {waypoints.map((point, index) => (
        <MapLibre.Marker key={point.id} id={point.id} lngLat={point.coordinate}>
          <View style={{ width: index === waypoints.length - 1 ? 24 : 19, height: index === waypoints.length - 1 ? 24 : 19,
            borderRadius: 12, borderWidth: 3, borderColor: theme.colors.white,
            backgroundColor: index === 0 ? theme.colors.accent : theme.colors.primary }} />
        </MapLibre.Marker>
      ))}
    </MapLibre.Map>
  );
}

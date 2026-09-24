import Constants from 'expo-constants';
import { useAppTheme } from '@/constants/theme';
import type { TripWaypoint } from '@/features/mobility/data/passenger-home.data';
import type { RouteGeometry } from '@/features/mobility/services/route.service';
import { RouteMapFallback } from '@/features/mobility/components/RouteMapFallback';
import { WaypointDetails } from '@/features/mobility/components/WaypointDetails';
import { WaypointPin } from '@/features/mobility/components/WaypointPin';

type Props = {
  waypoints: readonly TripWaypoint[];
  routeGeometry: RouteGeometry | null;
  expanded?: boolean;
  selectedWaypointId?: string | null;
  onWaypointPress?: (id: string) => void;
  onMapPress?: () => void;
};

export function RouteMap({ waypoints, routeGeometry, expanded = false, selectedWaypointId, onWaypointPress, onMapPress }: Props) {
  const theme = useAppTheme();

  // Expo Go no incluye el módulo nativo MapLibre.
  if (Constants.appOwnership === 'expo') return <RouteMapFallback waypoints={waypoints} routeGeometry={routeGeometry}
    expanded={expanded} selectedWaypointId={selectedWaypointId} onWaypointPress={onWaypointPress} onMapPress={onMapPress} />;

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
  const selectedPoint = waypoints.find((point) => point.id === selectedWaypointId);
  const selectedIndex = waypoints.findIndex((point) => point.id === selectedWaypointId);
  const detailSide = selectedIndex === 0 ? 'right' : 'left';

  return (
    <MapLibre.Map mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" androidView="texture"
      style={{ flex: 1 }} logo={false} attribution attributionPosition={{ bottom: 4, right: 4 }}
      compass={false} dragPan touchZoom doubleTapZoom touchRotate={false} touchPitch={false}
      onPress={onMapPress}>
      <MapLibre.Camera initialViewState={{ bounds, padding: expanded
        ? { top: 100, right: 44, bottom: 140, left: 44 }
        : { top: 20, right: 24, bottom: 20, left: 24 } }} />
      {routeGeometry ? (
        <MapLibre.GeoJSONSource id="passenger-route" data={routeGeometry}>
          <MapLibre.Layer id="passenger-route-outline" type="line" paint={{ 'line-color': '#12141A', 'line-width': 10, 'line-opacity': 0.9 }}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }} />
          <MapLibre.Layer id="passenger-route-line" type="line" paint={{ 'line-color': lineColor, 'line-width': 5, 'line-opacity': 0.95 }}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }} />
        </MapLibre.GeoJSONSource>
      ) : null}
      {waypoints.map((point, index) => (
        <MapLibre.Marker key={point.id} id={point.id} lngLat={point.coordinate}
          onPress={() => onWaypointPress?.(point.id)}>
          <WaypointPin number={index + 1} destination={index === waypoints.length - 1}
            selected={point.id === selectedWaypointId} />
        </MapLibre.Marker>
      ))}
      {selectedPoint ? (
        <MapLibre.Marker key={`detail-${selectedPoint.id}`} id={`detail-${selectedPoint.id}`}
          lngLat={selectedPoint.coordinate} anchor={detailSide === 'left' ? 'right' : 'left'}
          offset={detailSide === 'left' ? [-26, 0] : [26, 0]}>
          <WaypointDetails point={selectedPoint} side={detailSide} />
        </MapLibre.Marker>
      ) : null}
    </MapLibre.Map>
  );
}

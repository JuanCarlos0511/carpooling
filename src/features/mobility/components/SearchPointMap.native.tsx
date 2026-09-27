import { useEffect, useRef } from 'react';
import Constants from 'expo-constants';
import { MapPin } from 'lucide-react-native';
import type { CameraRef } from '@maplibre/maplibre-react-native';
import { useAppTheme } from '@/constants/theme';
import { SearchPointMapUnavailable, type SearchPointMapProps } from './SearchPointMapFallback';

const TAMPICO_CENTER: [number, number] = [-97.8645, 22.2553];

export function SearchPointMap({ point, onSelect, resetToken }: SearchPointMapProps) {
  const theme = useAppTheme();
  const camera = useRef<CameraRef>(null);
  useEffect(() => {
    if (resetToken) camera.current?.easeTo({ center: TAMPICO_CENTER, zoom: 12, bearing: 0, pitch: 0, duration: 350 });
  }, [resetToken]);
  if (Constants.appOwnership === 'expo') return <SearchPointMapUnavailable />;
  const MapLibre = require('@maplibre/maplibre-react-native') as typeof import('@maplibre/maplibre-react-native');
  return (
    <MapLibre.Map style={{ flex: 1 }} androidView="texture" logo={false} attribution
      attributionPosition={{ bottom: 8, right: 8 }} compass={false} touchRotate={false} touchPitch={false}
      mapStyle={theme.dark ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
        : 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'}
      onLongPress={(event) => {
        const [lon, lat] = event.nativeEvent.lngLat;
        onSelect({ lat, lon });
      }}>
      <MapLibre.Camera ref={camera} initialViewState={{ center: point ? [point.lon, point.lat] : TAMPICO_CENTER, zoom: point ? 14 : 12 }} />
      {point ? <MapLibre.Marker id="publication-search-point" lngLat={[point.lon, point.lat]} anchor="bottom">
        <MapPin size={38} fill={theme.colors.accentStrong} color={theme.colors.surface} strokeWidth={2} />
      </MapLibre.Marker> : null}
    </MapLibre.Map>
  );
}

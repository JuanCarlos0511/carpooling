import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';

import { useAppTheme } from '@/constants/theme';
import type { Coordinate, TripWaypoint } from '@/features/mobility/data/passenger-home.data';
import type { RouteGeometry } from '@/features/mobility/services/route.service';
import { WaypointDetails } from '@/features/mobility/components/WaypointDetails';

type Props = {
  waypoints: readonly TripWaypoint[];
  routeGeometry: RouteGeometry | null;
  expanded?: boolean;
  selectedWaypointId?: string | null;
  onWaypointPress?: (id: string) => void;
  onMapPress?: () => void;
};

export function RouteMapFallback({ waypoints, routeGeometry, selectedWaypointId, onWaypointPress, onMapPress }: Props) {
  const theme = useAppTheme();
  const [size, setSize] = useState({ width: 0, height: 0 });
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
  const selectedPoint = waypoints.find((point) => point.id === selectedWaypointId);
  const selectedPosition = selectedPoint ? project(selectedPoint.coordinate) : null;
  const scale = Math.min(size.width / 400, size.height / 250);
  const selectedX = selectedPosition ? (size.width - 400 * scale) / 2 + selectedPosition.x * scale : 0;
  const selectedY = selectedPosition ? (size.height - 250 * scale) / 2 + selectedPosition.y * scale : 0;
  const detailSide = selectedX > size.width / 2 ? 'left' : 'right';
  const cardLeft = detailSide === 'left' ? selectedX - 210 : selectedX + 20;

  return (
    <View style={styles.container} onLayout={(event) => setSize(event.nativeEvent.layout)}>
      <Svg width="100%" height="100%" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet" onPress={onMapPress}>
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
          const destination = index === waypoints.length - 1;
          return (
            <G key={point.id} onPress={() => onWaypointPress?.(point.id)}>
              <Circle cx={x} cy={y} r={17} fill={destination ? theme.colors.primary : routeColor}
                stroke="#FFFFFF" strokeWidth={point.id === selectedWaypointId ? 4 : 2.5} />
              {destination ? (
                <Path d={`M${x - 5} ${y + 8} V${y - 8} H${x + 7} L${x + 3} ${y - 3} L${x + 7} ${y + 2} H${x - 5}`}
                  stroke="#FFFFFF" strokeWidth={2} strokeLinejoin="round" fill="none" />
              ) : (
                <SvgText x={x} y={y + 5} textAnchor="middle" fill="#FFFFFF" fontSize={15} fontWeight="bold">
                  {index + 1}
                </SvgText>
              )}
              <Circle cx={x} cy={y} r={23} fill="transparent" />
            </G>
          );
        })}
      </Svg>
      <View style={styles.label}><Text style={styles.labelText}>Vista previa del trayecto</Text></View>
      {selectedPoint && selectedPosition && size.width > 0 ? (
        <View style={[styles.callout, { left: Math.max(8, Math.min(cardLeft, size.width - 198)),
          top: Math.max(8, Math.min(selectedY - 58, size.height - 135)) }]}>
          <WaypointDetails point={selectedPoint} side={detailSide} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#171C25' },
  label: { position: 'absolute', left: 8, top: 8, borderRadius: 6, backgroundColor: 'rgba(16, 17, 20, 0.84)', paddingHorizontal: 7, paddingVertical: 4 },
  labelText: { color: '#FFFFFF', fontSize: 10 },
  callout: { position: 'absolute' },
});

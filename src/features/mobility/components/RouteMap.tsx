import type { TripWaypoint } from '@/features/mobility/data/passenger-home.data';
import type { RouteGeometry } from '@/features/mobility/services/route.service';
import { RouteMapFallback } from '@/features/mobility/components/RouteMapFallback';

// TypeScript and web use this preview; Metro selects .native on Android and iOS.
export function RouteMap(props: { waypoints: readonly TripWaypoint[]; routeGeometry: RouteGeometry | null }) {
  return <RouteMapFallback {...props} />;
}

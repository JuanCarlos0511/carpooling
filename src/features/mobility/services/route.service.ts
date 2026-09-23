import type { Coordinate } from '@/features/mobility/data/passenger-home.data';

export type RouteGeometry = {
  type: 'LineString';
  coordinates: Coordinate[];
};

export type PlannedRoute = {
  geometry: RouteGeometry;
  distanceKm: number;
  durationMinutes: number;
};

type OsrmResponse = {
  code?: string;
  routes?: Array<{
    geometry?: RouteGeometry;
    distance?: number;
    duration?: number;
  }>;
};

export async function getPlannedRoute(waypoints: readonly Coordinate[], signal?: AbortSignal): Promise<PlannedRoute> {
  if (waypoints.length < 2) throw new Error('La ruta necesita al menos dos puntos.');

  const coordinates = waypoints.map(([longitude, latitude]) => `${longitude},${latitude}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error('No se pudo consultar la ruta.');

  const data = await response.json() as OsrmResponse;
  const route = data.routes?.[0];
  if (data.code !== 'Ok' || route?.geometry?.type !== 'LineString'
    || !Array.isArray(route.geometry.coordinates) || route.geometry.coordinates.length < 2
    || typeof route.distance !== 'number' || typeof route.duration !== 'number') {
    throw new Error('La ruta recibida no es válida.');
  }

  return {
    geometry: route.geometry,
    distanceKm: route.distance / 1000,
    durationMinutes: Math.round(route.duration / 60),
  };
}

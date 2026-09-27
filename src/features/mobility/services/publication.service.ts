import type { TripWaypoint } from '@/features/mobility/data/passenger-home.data';

export type PublicationRequestStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
export type PublicationRequest = {
  id: string;
  tripId: string;
  boardingStopId: string;
  status: PublicationRequestStatus;
  updatedAt: string;
};

export type PublicationStop = {
  id: string;
  position: number;
  kind: 'origin' | 'stop' | 'destination';
  name: string;
  lat: number;
  lon: number;
  scheduledAt: string;
  completedAt: string | null;
};

export type PublicationTrip = {
  id: string;
  driver: { id: string; fullName: string; photoUrl?: string | null };
  route: { destination: { name: string } };
  departureAt: string;
  arrivalAt: string;
  capacity: number;
  availableSeats: number;
  price: number;
  notes: string;
  status: 'open' | 'closed' | 'in_progress' | 'completed' | 'cancelled';
  stops: PublicationStop[];
};

export type PublicationRequestWithTrip = PublicationRequest & { trip: PublicationTrip };

const API_ROOT = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

async function readResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { code?: string; message?: string } | null;
    throw new Error(payload?.message ?? `HTTP_${response.status}`);
  }
  return response.json() as Promise<T>;
}

function endpoint(path: string): string {
  if (!API_ROOT) throw new Error('Configura EXPO_PUBLIC_API_URL para consultar publicaciones.');
  return `${API_ROOT}/api/v1${path}`;
}

export async function getOpenPublications(signal?: AbortSignal): Promise<PublicationTrip[]> {
  const response = await fetch(endpoint('/trips'), { headers: { Accept: 'application/json' }, signal });
  const payload = await readResponse<{ trips: PublicationTrip[] }>(response);
  return payload.trips;
}

export async function getPublication(id: string, signal?: AbortSignal): Promise<PublicationTrip> {
  const response = await fetch(endpoint(`/trips/${encodeURIComponent(id)}`), { headers: { Accept: 'application/json' }, signal });
  const payload = await readResponse<{ trip: PublicationTrip }>(response);
  return payload.trip;
}

export async function getMyPublicationRequests(accessToken: string, signal?: AbortSignal): Promise<PublicationRequestWithTrip[]> {
  const response = await fetch(endpoint('/users/me/trips'), {
    headers: { Accept: 'application/json', Authorization: `Bearer ${accessToken}` }, signal,
  });
  const payload = await readResponse<{ requests: PublicationRequestWithTrip[] }>(response);
  return payload.requests;
}

export async function getPublicationRequest(tripId: string, accessToken: string, signal?: AbortSignal): Promise<PublicationRequest | null> {
  const requests = await getMyPublicationRequests(accessToken, signal);
  return requests.find((request) => request.tripId === tripId) ?? null;
}

export function hasActivePublicationRequest(request: PublicationRequest): boolean {
  return request.status === 'pending' || request.status === 'accepted';
}

export async function requestPublicationSeat(tripId: string, boardingStopId: string, accessToken: string): Promise<PublicationRequest> {
  const response = await fetch(endpoint(`/trips/${encodeURIComponent(tripId)}/requests`), {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ boardingStopId }),
  });
  const payload = await readResponse<{ request: PublicationRequest }>(response);
  return payload.request;
}

export async function changePublicationBoardingStop(tripId: string, boardingStopId: string, accessToken: string): Promise<PublicationRequest> {
  const response = await fetch(endpoint(`/trips/${encodeURIComponent(tripId)}/my-request`), {
    method: 'PATCH',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ boardingStopId }),
  });
  const payload = await readResponse<{ request: PublicationRequest }>(response);
  return payload.request;
}

export async function cancelPublicationRequest(tripId: string, accessToken: string): Promise<PublicationRequest> {
  const response = await fetch(endpoint(`/trips/${encodeURIComponent(tripId)}/my-request`), {
    method: 'DELETE',
    headers: { Accept: 'application/json', Authorization: `Bearer ${accessToken}` },
  });
  const payload = await readResponse<{ request: PublicationRequest }>(response);
  return payload.request;
}

export function formatDeparture(iso: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    timeZone: 'America/Mexico_City', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).format(new Date(iso));
}

export function formatHour(iso: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    timeZone: 'America/Mexico_City', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).format(new Date(iso));
}

export function publicationText(trip: PublicationTrip): string {
  const intermediateStops = trip.stops.filter((stop) => stop.kind === 'stop');
  const firstStopTime = intermediateStops[0]?.scheduledAt ?? trip.departureAt;
  const passBy = intermediateStops.length > 0
    ? ` Paso por ${intermediateStops.map((stop) => stop.name).join(', ')}.`
    : '';
  const notes = trip.notes.trim();
  return `Viaje hacia ${trip.route.destination.name} el ${formatDeparture(firstStopTime)}.${passBy}${notes ? ` ${notes}` : ''}`;
}

export function passengerSeats(trip: PublicationTrip): { capacity: number; available: number; occupied: number } {
  const capacity = Math.min(3, Math.max(0, trip.capacity));
  const available = Math.min(capacity, Math.max(0, trip.availableSeats));
  return { capacity, available, occupied: capacity - available };
}

export function tripWaypoints(trip: PublicationTrip): TripWaypoint[] {
  return trip.stops.filter((stop) => stop.kind !== 'origin').map((stop, index) => ({
    id: stop.id,
    name: stop.name,
    detail: stop.kind === 'destination' ? 'Destino' : `Parada ${index + 1}`,
    coordinate: [stop.lon, stop.lat],
    arrivalTime: formatHour(stop.scheduledAt),
    status: stop.completedAt ? 'Completada' : 'En camino',
  }));
}

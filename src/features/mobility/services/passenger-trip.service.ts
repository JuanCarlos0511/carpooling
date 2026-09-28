import type { PublicationStop, PublicationTrip } from '@/features/mobility/services/publication.service';

type PassengerRequest = {
  id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  boardingStopId: string;
  boardingPin: string | null;
  trip: PublicationTrip;
};

export type AgreedTrip = {
  requestId: string;
  trip: PublicationTrip;
  boardingStop: PublicationStop | null;
  boardingPin: string | null;
};

const API_ROOT = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

export async function getAgreedTrip(token: string, signal?: AbortSignal): Promise<AgreedTrip | null> {
  if (!API_ROOT) throw new Error('Configura EXPO_PUBLIC_API_URL para consultar tus viajes.');
  const response = await fetch(`${API_ROOT}/api/v1/users/me/trips`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    signal,
  });
  if (!response.ok) throw new Error('No fue posible cargar tu viaje acordado.');
  const payload = await response.json() as { requests: PassengerRequest[] };
  const request = payload.requests
    .filter((item) => item.status === 'accepted'
      && ['open', 'closed', 'in_progress'].includes(item.trip.status))
    .sort((left, right) => new Date(left.trip.departureAt).getTime() - new Date(right.trip.departureAt).getTime())[0];
  if (!request) return null;
  const boardingStop = request.trip.stops.find((stop) => stop.id === request.boardingStopId);
  return {
    requestId: request.id,
    trip: request.trip,
    boardingStop: boardingStop ?? null,
    boardingPin: /^\d{4}$/.test(request.boardingPin ?? '') ? request.boardingPin : null,
  };
}

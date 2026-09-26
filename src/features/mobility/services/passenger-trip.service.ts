import type { PublicationStop, PublicationTrip } from '@/features/mobility/services/publication.service';

type PassengerRequest = {
  id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  boardingStopId: string;
  boardingPin: string | null;
  trip: PublicationTrip;
};

export type AgreedTrip = {
  requestId: string;
  trip: PublicationTrip;
  boardingStop: PublicationStop;
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
  const now = Date.now();
  const request = payload.requests
    .filter((item) => item.status === 'accepted'
      && ['open', 'closed', 'in_progress'].includes(item.trip.status)
      && (item.trip.status === 'in_progress' || new Date(item.trip.arrivalAt).getTime() > now))
    .sort((left, right) => new Date(left.trip.departureAt).getTime() - new Date(right.trip.departureAt).getTime())[0];
  if (!request) return null;
  const boardingStop = request.trip.stops.find((stop) => stop.id === request.boardingStopId);
  if (!boardingStop) throw new Error('El punto de encuentro del viaje no está disponible.');
  return {
    requestId: request.id,
    trip: request.trip,
    boardingStop,
    boardingPin: /^\d{4}$/.test(request.boardingPin ?? '') ? request.boardingPin : null,
  };
}

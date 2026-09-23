export type Coordinate = [longitude: number, latitude: number];

export type TripWaypoint = {
  id: string;
  name: string;
  detail: string;
  coordinate: Coordinate;
};

export const passengerHomeData = {
  brand: {
    name: 'Hopn',
    subtitle: 'Red universitaria',
  },
  upcomingTrip: {
    driver: 'Carlos Méndez',
    car: 'Tesla Model 3 · Gris Titanio',
    pin: '8492',
    meetingPoint: 'Torre Virreyes',
    departure: 'Hoy · 18:30',
  },
  featuredTrip: {
    driver: 'Mariana Solís',
    postedAgo: 'hace 15 min',
    contribution: 60,
    currency: 'MXN',
    departureTime: '18:30',
    description: 'Saliendo a Campus Sur a las 18:30 hrs. Llevo playlist de indie rock y café recién hecho ☕. ¡Tengo 2 lugares libres para viajar relajados!',
    carCapacity: 4,
    freeSeats: 2,
    occupiedSeats: 2,
    waypoints: [
      { id: 'origin', name: 'Parque España', detail: 'Salida', coordinate: [-99.1685, 19.4137] },
      { id: 'stop-1', name: 'WTC Insurgentes', detail: 'Parada 1', coordinate: [-99.1720, 19.3950] },
      { id: 'destination', name: 'Campus Univ. Sur', detail: 'Destino', coordinate: [-99.1800, 19.3030] },
    ] satisfies TripWaypoint[],
  },
} as const;

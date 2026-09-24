export type Coordinate = [longitude: number, latitude: number];

export type TripWaypoint = {
  id: string;
  name: string;
  detail: string;
  coordinate: Coordinate;
  arrivalTime: string;
  status: 'En camino' | 'Completada';
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
    description: 'Salgo del centro de Altamira rumbo a la UAT Campus Sur a las 18:30 hrs. Paso por Plaza Herradura y tengo 2 lugares libres. ¡Vamos juntos!',
    carCapacity: 4,
    freeSeats: 2,
    occupiedSeats: 2,
    waypoints: [
      { id: 'origin', name: 'Palacio Municipal de Altamira', detail: 'Salida · Altamira', coordinate: [-97.9367913, 22.3913033], arrivalTime: '18:30', status: 'Completada' },
      { id: 'stop-1', name: 'Plaza Herradura', detail: 'Parada · Tampico', coordinate: [-97.875046, 22.271906], arrivalTime: '19:00', status: 'En camino' },
      { id: 'destination', name: 'UAT Campus Sur', detail: 'Destino · Tampico', coordinate: [-97.863252, 22.276037], arrivalTime: '19:15', status: 'En camino' },
    ] satisfies TripWaypoint[],
  },
} as const;

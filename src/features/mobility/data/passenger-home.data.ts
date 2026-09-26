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
} as const;

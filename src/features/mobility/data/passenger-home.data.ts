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
} as const;

import type { Ride } from '@/features/routes/ride.types';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export async function getRides(): Promise<Ride[]> {
  // Sustituir por fetch(`${apiUrl}/rides`) cuando exista el backend.
  void apiUrl;

  return [
    {
      id: 'ride-1',
      origin: 'Centro',
      destination: 'Campus Norte',
      departure: '08:15',
      seatsAvailable: 2,
      imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200',
    },
    {
      id: 'ride-2',
      origin: 'La Floresta',
      destination: 'Parque Industrial',
      departure: '09:00',
      seatsAvailable: 1,
      imageUrl: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1200',
    },
  ];
}

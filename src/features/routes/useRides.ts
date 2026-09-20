import { useEffect, useState } from 'react';

import { getRides } from '@/features/routes/rides.service';
import type { Ride } from '@/features/routes/ride.types';

export function useRides() {
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    let mounted = true;

    getRides().then((nextRides) => {
      if (mounted) setRides(nextRides);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return { rides };
}

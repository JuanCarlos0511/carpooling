import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { getAgreedTrip, type AgreedTrip } from '@/features/mobility/services/passenger-trip.service';

export function useAgreedTrip(accessToken: string | null) {
  const [trip, setTrip] = useState<AgreedTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [reloadToken, setReloadToken] = useState(0);

  useFocusEffect(useCallback(() => {
    const controller = new AbortController();
    setTrip(null);
    setError(undefined);
    if (!accessToken) {
      setLoading(false);
      return () => controller.abort();
    }
    setLoading(true);
    void getAgreedTrip(accessToken, controller.signal)
      .then((nextTrip) => setTrip(nextTrip))
      .catch(() => {
        if (!controller.signal.aborted) setError('No fue posible cargar tu viaje acordado.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [accessToken, reloadToken]));

  return { trip, loading, error, retry: () => setReloadToken((value) => value + 1) };
}

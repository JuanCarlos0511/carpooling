import { useCallback, useRef } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';

export function usePassengerDetailsNavigation() {
  const router = useRouter();
  const openingDetails = useRef(false);

  useFocusEffect(useCallback(() => {
    openingDetails.current = false;
  }, []));

  const openPublication = useCallback((tripId: string) => {
    if (openingDetails.current) return;
    openingDetails.current = true;
    router.push({ pathname: '/passenger/publicacion/[id]', params: { id: tripId } });
  }, [router]);

  const openAgreedTrip = useCallback(() => {
    if (openingDetails.current) return;
    openingDetails.current = true;
    router.push('/passenger/detalles');
  }, [router]);

  return { openPublication, openAgreedTrip };
}

import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getMyPublicationRequests, hasActivePublicationRequest, searchPublications,
  type PublicationSearchFilters, type PublicationTrip, type SearchLocation } from '@/features/mobility/services/publication.service';

type SearchSession = { controller: AbortController; filters: PublicationSearchFilters; offset: number; hasMore: boolean; busy: boolean };

export function usePublicationSearch(query: string, location: SearchLocation | null, accessToken: string | null) {
  const [trips, setTrips] = useState<PublicationTrip[]>([]);
  const [requestedTripIds, setRequestedTripIds] = useState<Set<string>>(() => new Set());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string>();
  const [moreError, setMoreError] = useState<string>();
  const [reloadToken, setReloadToken] = useState(0);
  const sessionRef = useRef<SearchSession | null>(null);

  useFocusEffect(useCallback(() => {
    const session: SearchSession = { controller: new AbortController(), filters: { q: query, location }, offset: 0, hasMore: false, busy: true };
    sessionRef.current = session;
    const signal = session.controller.signal;
    setLoading(true);
    setLoadingMore(false);
    setError(undefined);
    setMoreError(undefined);
    setHasMore(false);
    setTrips([]);
    // Debounce and abort on typing, filter changes, or leaving the screen.
    const timer = setTimeout(() => {
      void Promise.all([
        searchPublications(session.filters, signal),
        accessToken ? getMyPublicationRequests(accessToken, signal) : Promise.resolve([]),
      ]).then(([page, requests]) => {
        if (signal.aborted) return;
        session.offset = page.trips.length;
        session.hasMore = page.hasMore;
        setTrips(page.trips);
        setHasMore(page.hasMore);
        setRequestedTripIds(new Set(requests.filter(hasActivePublicationRequest).map((request) => request.tripId)));
      }).catch(() => {
        if (!signal.aborted) setError('No fue posible buscar publicaciones. Vuelve a intentarlo.');
      }).finally(() => {
        if (!signal.aborted) { session.busy = false; setLoading(false); }
      });
    }, 350);
    return () => { clearTimeout(timer); session.controller.abort(); };
  }, [query, location, accessToken, reloadToken]));

  const loadMore = useCallback(async () => {
    const session = sessionRef.current;
    if (!session || session.controller.signal.aborted || session.busy || !session.hasMore) return;
    session.busy = true;
    setLoadingMore(true);
    setMoreError(undefined);
    try {
      const page = await searchPublications({ ...session.filters, offset: session.offset }, session.controller.signal);
      if (session.controller.signal.aborted) return;
      session.offset += page.trips.length;
      session.hasMore = page.hasMore;
      setTrips((previous) => [...previous, ...page.trips.filter((trip) => !previous.some((item) => item.id === trip.id))]);
      setHasMore(page.hasMore);
    } catch {
      if (!session.controller.signal.aborted) setMoreError('No se pudieron cargar más publicaciones.');
    } finally {
      if (!session.controller.signal.aborted) { session.busy = false; setLoadingMore(false); }
    }
  }, []);

  return { trips, requestedTripIds, loading, loadingMore, hasMore, error, moreError, loadMore,
    retry: () => setReloadToken((value) => value + 1) };
}

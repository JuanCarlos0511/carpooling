import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { Coordinate } from '@/features/mobility/data/passenger-home.data';
import { getPlannedRoute, type PlannedRoute } from '@/features/mobility/services/route.service';

export function usePlannedRoute(waypoints: readonly Coordinate[]) {
  const [route, setRoute] = useState<PlannedRoute | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const coordinateKey = waypoints.map((point) => point.join(',')).join(';');

  useFocusEffect(useCallback(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 12000);
    setRoute(null);
    if (waypoints.length < 2) {
      clearTimeout(timeout);
      setStatus('ready');
      return () => { active = false; controller.abort(); };
    }
    setStatus('loading');
    void getPlannedRoute(waypoints, controller.signal)
      .then((result) => {
        if (active) {
          setRoute(result);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (active) setStatus('error');
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
    // coordinateKey tracks changes in values without re-fetching for a new array reference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinateKey]));

  return { route, status };
}

import { SearchPointMapUnavailable, type SearchPointMapProps } from './SearchPointMapFallback';

export function SearchPointMap(_props: SearchPointMapProps) {
  return <SearchPointMapUnavailable />;
}

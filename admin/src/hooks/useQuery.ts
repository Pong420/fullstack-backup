import { useCallback, useEffect, useState, useLayoutEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';

type SetQuery<T> = (query: T) => void;

export type UseQueryTransform<T extends {}> = (
  values: Record<string, string>
) => T;

export function useQuery<T extends {}>(
  transform?: undefined
): [Record<string, string>, SetQuery<T>];

export function useQuery<T extends {}>(
  transform: UseQueryTransform<T>
): [Partial<T>, SetQuery<T>];

export function useQuery<T extends {}>(
  transform: UseQueryTransform<T> = (v: any) => v
): [Record<string, string> | Partial<T>, SetQuery<T>] {
  const history = useHistory();
  const search = useLocation().search.slice(1);
  const [state, setState] = useState<Partial<T>>({
    ...qs.parse(search),
    ...transform(qs.parse(search))
  });
  const [mounted, setMounted] = useState(false);

  const setQuery = useCallback(
    (query: T) => setState(curr => ({ ...curr, ...transform(query) })),
    [transform]
  );

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    mounted && history.replace({ search: qs.stringify(state) });
  }, [history, state, mounted]);

  return [state, setQuery];
}

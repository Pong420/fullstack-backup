import { useCallback, useMemo } from 'react';
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
  transform?: UseQueryTransform<T>
): [Record<string, string> | Partial<T>, SetQuery<T>] {
  const history = useHistory();
  const { search } = useLocation();

  // FIXME: duplicated replace event
  const values = useMemo(() => {
    const values: Record<string, string> = qs.parse(search.slice(1)) || {};
    return transform ? { ...values, ...transform(values) } : values;
  }, [search, transform]);

  const setQuery = useCallback<SetQuery<T>>(
    query => history.replace({ search: qs.stringify({ ...values, ...query }) }),
    [history, values]
  );

  return [values, setQuery];
}

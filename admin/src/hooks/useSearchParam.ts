import { useCallback } from 'react';
import { history } from '../store';
import qs from 'qs';

export function useSearchParam<T extends {}>() {
  const setSearchParam = useCallback(
    (payload: Partial<T> | ((params: Partial<T>) => Partial<T>)) => {
      const newState =
        typeof payload === 'function'
          ? payload(qs.parse(window.location.search.slice(1)))
          : payload;

      for (const key in newState) {
        if (!newState[key]) {
          delete newState[key];
        }
      }
      history.push({ search: qs.stringify(newState) });
    },
    []
  );

  return { setSearchParam };
}

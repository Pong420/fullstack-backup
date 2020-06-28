import { useCallback } from 'react';
import { history } from '../store';
import qs from 'qs';

export function useSearchParam<T extends { [x: string]: any }>() {
  const setSearchParam = useCallback(
    (payload: Partial<T> | ((params: Partial<T>) => Partial<T>)) => {
      const newState =
        typeof payload === 'function'
          ? payload(
              qs.parse(window.location.search.slice(1), {
                parseArrays: true
              }) as T
            )
          : payload;

      // remove value equals to undefined and ''
      for (const key in newState) {
        if (typeof newState[key] === 'undefined' || newState[key] === '') {
          delete newState[key];
        }
      }

      history.push({
        search: qs.stringify(newState, { encodeValuesOnly: true })
      });
    },
    []
  );
  return { setSearchParam };
}

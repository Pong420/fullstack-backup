import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import qs, { ParsedQuery } from 'query-string';

export function useSearchParam<T extends ParsedQuery<string | number>>() {
  const history = useHistory();
  const setSearchParam = useCallback(
    (payload: Partial<T> | ((params: Partial<T>) => Partial<T>)) => {
      const newState =
        typeof payload === 'function'
          ? payload(
              qs.parse(window.location.search.slice(1), {
                parseNumbers: true
              }) as T
            )
          : payload;

      // remove value equals to undefined and ''
      for (const key in newState) {
        if (typeof newState[key] === 'undefined' || newState[key] === '') {
          delete newState[key];
        }
      }

      history.push({ search: qs.stringify(newState) });
    },
    [history]
  );

  return { setSearchParam };
}

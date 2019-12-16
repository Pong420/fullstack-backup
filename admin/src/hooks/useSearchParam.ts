import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';

export function useSearchParam<T extends {}>() {
  const history = useHistory();
  const search = useLocation().search.slice(1);

  const setSearchParam = useCallback(
    (params: T) => {
      const newState = { ...qs.parse(search), ...params };
      for (const key in newState) {
        if (!newState[key]) {
          delete newState[key];
        }
      }
      history.push({ search: qs.stringify(newState) });
    },
    [history, search]
  );

  return { setSearchParam };
}

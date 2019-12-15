import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';

type SearchParams = Partial<Record<string, string>>;

interface SearchParamContextValue {
  searchParams: SearchParams;
  setSearchParam: (params: SearchParams) => void;
  removeSearchParam: (keys_?: string | string[]) => void;
}

export const SearchParamContext = createContext<SearchParamContextValue>({
  searchParams: {},
  setSearchParam: () => {},
  removeSearchParam: () => {}
});

export function SearchParamProvider({ children }: { children: ReactNode }) {
  const history = useHistory();
  const search = useLocation().search.slice(1);

  const searchParams = useMemo<SearchParams>(() => qs.parse(search), [search]);

  const actions = useMemo(() => {
    const handler = (fn: (state: SearchParams) => SearchParams) => {
      history.push({ search: qs.stringify(fn({ ...searchParams })) });
    };

    const setSearchParam: SearchParamContextValue['setSearchParam'] = params => {
      handler(curr => {
        const newState = { ...curr, ...params };
        for (const key in newState) {
          if (!newState[key]) {
            delete newState[key];
          }
        }
        return newState;
      });
    };

    const removeSearchParam: SearchParamContextValue['removeSearchParam'] = _keys => {
      handler(curr => {
        if (_keys) {
          const keys = Array.isArray(_keys) ? _keys : [_keys];
          return keys.reduce((acc, key) => {
            delete acc[key];
            return acc;
          }, curr);
        }
        return {};
      });
    };

    return { setSearchParam, removeSearchParam };
  }, [history, searchParams]);

  return React.createElement(
    SearchParamContext.Provider,
    { value: { searchParams, ...actions } },
    children
  );
}

type SetSearchParam<T> = (params: Partial<T>) => void;

export type UseSearchParamTransform<T extends {}> = (values: SearchParams) => T;

export function useSearchParam<T extends {}>(
  transform?: undefined
): [SearchParams, SetSearchParam<SearchParams>];

export function useSearchParam<T extends {}>(
  transform: UseSearchParamTransform<T>
): [Partial<T>, SetSearchParam<T>];

export function useSearchParam<T extends {}>(
  transform?: UseSearchParamTransform<T>
): [SearchParams | Partial<T>, SetSearchParam<T>] {
  const { searchParams, setSearchParam } = useContext(SearchParamContext);
  const params = useMemo(
    () => ({
      ...searchParams,
      ...(transform ? transform(searchParams) : searchParams)
    }),
    [searchParams, transform]
  );
  return [params, setSearchParam];
}

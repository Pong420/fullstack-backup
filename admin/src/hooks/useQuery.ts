import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';

type SearchParams = Partial<Record<string, string>>;

interface QueryContextValue {
  searchParams: SearchParams;
  setQuery: (query: SearchParams) => void;
  removeQuery: (keys_?: string | string[]) => void;
}

export const QueryContext = createContext<QueryContextValue>({
  searchParams: {},
  setQuery: () => {},
  removeQuery: () => {}
});

export function QueryProvider({ children }: { children: ReactNode }) {
  const history = useHistory();
  const search = useLocation().search.slice(1);

  const searchParams = useMemo<SearchParams>(() => qs.parse(search), [search]);

  const actions = useMemo(() => {
    const handler = (fn: (state: SearchParams) => SearchParams) => {
      history.push({ search: qs.stringify(fn({ ...searchParams })) });
    };

    const setQuery: QueryContextValue['setQuery'] = query => {
      handler(curr => {
        const newState = { ...curr, ...query };
        for (const key in newState) {
          if (!newState[key]) {
            delete newState[key];
          }
        }
        return newState;
      });
    };

    const removeQuery: QueryContextValue['removeQuery'] = keys_ => {
      handler(curr => {
        if (keys_) {
          const keys = Array.isArray(keys_) ? keys_ : [keys_];
          return keys.reduce((acc, key) => {
            delete acc[key];
            return acc;
          }, curr);
        }
        return {};
      });
    };

    return { setQuery, removeQuery };
  }, [history, searchParams]);

  return React.createElement(
    QueryContext.Provider,
    { value: { searchParams, ...actions } },
    children
  );
}

type SetQuery<T> = (query: Partial<T>) => void;

export type UseQueryTransform<T extends {}> = (values: SearchParams) => T;

export function useQuery<T extends {}>(
  transform?: undefined
): [SearchParams, SetQuery<T>];

export function useQuery<T extends {}>(
  transform: UseQueryTransform<T>
): [Partial<T>, SetQuery<T>];

export function useQuery<T extends {}>(
  transform?: UseQueryTransform<T>
): [SearchParams | Partial<T>, SetQuery<T>] {
  const { searchParams, setQuery } = useContext(QueryContext);
  const params = useMemo(
    () => ({
      ...searchParams,
      ...(transform ? transform(searchParams) : searchParams)
    }),
    [searchParams, transform]
  );
  return [params, setQuery];
}

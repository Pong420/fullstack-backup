import React, {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
  useMemo
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';

// TODO: better typing

interface QueryContextValue {
  query: Record<string, string>;
  setQuery: (query: Record<string, string>) => void;
}

export const QueryContext = createContext<QueryContextValue>({
  query: {},
  setQuery: () => {}
});

export function QueryProvider({ children }: { children: ReactNode }) {
  const history = useHistory();
  const search = useLocation().search.slice(1);

  const [state, setState] = useState<Record<string, string>>(qs.parse(search));
  const [mounted, setMounted] = useState(false);

  const setQuery = useCallback(
    (query: Record<string, string>) =>
      setState(curr => {
        const state = { ...curr, ...query };
        for (const key in state) {
          if (!state[key]) {
            delete state[key];
          }
        }
        return state;
      }),
    []
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    mounted && history.replace({ search: qs.stringify(state) });
  }, [history, state, mounted]);

  return React.createElement(
    QueryContext.Provider,
    { value: { query: state, setQuery } },
    children
  );
}

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
  const { query, setQuery } = useContext(QueryContext);
  const state = useMemo(
    () => ({ ...query, ...(transform ? transform(query) : query) }),
    [query, transform]
  );
  return [state, setQuery];
}

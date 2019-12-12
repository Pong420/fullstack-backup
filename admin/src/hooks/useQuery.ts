import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
  useMemo
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';

interface QueryContextValue {
  query: Record<string, string>;
  setQuery: (query: Record<string, string>) => void;
  removeQuery: (keys_?: string | string[]) => void;
}

export const QueryContext = createContext<QueryContextValue>({
  query: {},
  setQuery: () => {},
  removeQuery: () => {}
});

export function QueryProvider({ children }: { children: ReactNode }) {
  const history = useHistory();
  const search = useLocation().search.slice(1);

  const [state, setState] = useState<Record<string, string>>(qs.parse(search));
  const [mounted, setMounted] = useState(false);

  const actions = useMemo(() => {
    const setQuery: QueryContextValue['setQuery'] = query =>
      setState(curr => {
        const state = { ...curr, ...query };
        for (const key in state) {
          if (!state[key]) {
            delete state[key];
          }
        }
        return state;
      });

    const removeQuery: QueryContextValue['removeQuery'] = keys_ => {
      setState(curr => {
        if (keys_) {
          const keys = Array.isArray(keys_) ? keys_ : [keys_];
          return keys.reduce(
            (acc, key) => {
              delete acc[key];
              return acc;
            },
            { ...curr }
          );
        }
        return {};
      });
    };

    return { setQuery, removeQuery };
  }, []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    mounted && history.replace({ search: qs.stringify(state) });
  }, [history, state, mounted]);

  return React.createElement(
    QueryContext.Provider,
    { value: { query: state, ...actions } },
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

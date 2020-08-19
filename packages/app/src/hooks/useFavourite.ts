import React, {
  useEffect,
  useRef,
  ProviderProps,
  ReactNode,
  useState
} from 'react';
import { defer, Subject, empty } from 'rxjs';
import {
  map,
  retry,
  groupBy,
  mergeMap,
  debounceTime,
  tap,
  switchMap,
  catchError
} from 'rxjs/operators';
import { useRxAsync } from 'use-rx-hooks';
import { Schema$Product, FavouriteAction } from '@fullstack/typings';
import { getFavourites, toggleFavourite } from '@/service';
import { toaster } from '@/components/Toast';
import { useAuth } from './useAuth';
import { createUseRxCRUDReducer } from './crud';

type Schema = Schema$Product | { id: string };

const [
  favourite$,
  favouriteState,
  useFavouriteReducer
] = createUseRxCRUDReducer<Schema, 'id'>('id');

type Payload = [boolean, Schema];
type State = ReturnType<typeof useFavouriteReducer>[0];
type Actions = ReturnType<typeof useFavouriteReducer>[1] & {
  toggleFavourite: (payload: Payload) => void;
};

const StateContext = React.createContext({} as State);
const ActionsContext = React.createContext({} as Actions);

export function useFavouriteActions() {
  const context = React.useContext(ActionsContext);
  if (context === undefined) {
    throw new Error(
      'useFavouriteActions must be used within a FavouriteProvider'
    );
  }
  return context;
}

export function useFavourite(id: string) {
  const [isFavourite, setIsFavourite] = useState(
    favouriteState.ids.includes(id)
  );

  useEffect(() => {
    const subscription = favourite$.subscribe(state => {
      const value = state.ids.includes(id);
      if (value !== isFavourite) {
        setIsFavourite(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [id, isFavourite]);

  return [isFavourite, useFavouriteActions()] as const;
}

const request = () =>
  defer(() => getFavourites({ page: 1, size: 9999 })).pipe(
    map(res =>
      res.data.data.data.map(
        ({ product }, index) => product || { id: `${index}-${+new Date()}` }
      )
    ),
    retry(5)
  );

export function FavouriteProvider({ children }: { children: ReactNode }) {
  const [state, actions] = useFavouriteReducer();
  const { loginStatus } = useAuth();

  const trigger$ = useRef(new Subject<Payload>());
  const actionConext = useRef<Actions>({
    ...actions,
    toggleFavourite: payload => {
      trigger$.current.next(payload);
    }
  });

  const { run } = useRxAsync(request, {
    defer: true,
    onSuccess: actions.paginate
  });

  useEffect(() => {
    if (loginStatus === 'required') {
      actions.reset();
    }
    if (loginStatus === 'loggedIn') {
      run();
    }
  }, [run, actions, loginStatus]);

  useEffect(() => {
    const subscription = trigger$.current
      .pipe(
        groupBy(([, product]) => product.id),
        mergeMap(group$ => {
          return group$.pipe(
            tap(([add, product]) =>
              add ? actions.create(product) : actions.delete(product)
            ),
            debounceTime(1000),
            switchMap(([add, product]) => {
              const action = add ? FavouriteAction.Add : FavouriteAction.Remove;
              return defer(() =>
                toggleFavourite({ product: product.id, action })
              ).pipe(
                map(res => res.data?.data?.product as Schema | null),
                map(payload => [product.id, payload] as const),
                catchError(error => {
                  toaster.apiError(`Failed to ${action} favourite`, error);
                  return empty();
                })
              );
            })
          );
        })
      )
      .subscribe(([id, product]) => {
        product ? actions.update(product) : actions.delete({ id });
      });
    return () => subscription.unsubscribe();
  }, [actions]);

  return React.createElement<ProviderProps<State>>(
    StateContext.Provider,
    { value: state },
    React.createElement<ProviderProps<Actions>>(
      ActionsContext.Provider,
      { value: actionConext.current },
      children
    )
  );
}

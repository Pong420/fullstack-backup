import React, {
  useMemo,
  useEffect,
  useRef,
  ProviderProps,
  ReactNode
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
import { createUseRxCRUDReducer } from '@fullstack/common/hooks';
import { getFavourites, toggleFavourite } from '@/service';
import { openConfirmModal } from '@/components/ConfirmModal';
import { toaster } from '@/components/Toast';
import { SemiBold } from '@/components/Text';
import { navigate } from '@/utils/navigation';
import { useAuth } from './useAuth';

type Schema = Schema$Product | { id: string };

const [
  //
  useFavouriteReducer,
  createSelector
] = createUseRxCRUDReducer<Schema, 'id'>('id');

type Payload = [boolean, Schema];
type State = ReturnType<typeof useFavouriteReducer>[0];
type Actions = ReturnType<typeof useFavouriteReducer>[1] & {
  toggleFavourite: (payload: Payload) => void;
};

const StateContext = React.createContext({} as State);
const ActionsContext = React.createContext({} as Actions);

export function useFavouriteState() {
  const context = React.useContext(StateContext);
  if (context === undefined) {
    throw new Error(
      'useFavouriteState must be used within a FavouriteProvider'
    );
  }
  return context;
}

export function useFavouriteActions() {
  const context = React.useContext(ActionsContext);
  if (context === undefined) {
    throw new Error(
      'useFavouriteActions must be used within a FavouriteProvider'
    );
  }
  return context;
}

export const useFavouriteIds = createSelector(
  state => state.ids,
  (i, o) => i.length === o.length
);

export const useFavouriteList = createSelector(
  state => state.list,
  (i, o) => i.length === o.length
);

export function useToggleFavourite(id: string) {
  const isFavourite = createSelector(
    state => state.ids.includes(id),
    (i, o) => i === o
  )();
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

  const actionConext = useMemo<Actions>(() => {
    return {
      ...actions,
      toggleFavourite: payload => {
        if (loginStatus === 'loggedIn') {
          trigger$.current.next(payload);
        } else {
          openConfirmModal({
            vertialFooter: true,
            title: '',
            content: React.createElement(
              SemiBold,
              { style: { fontSize: 20, textAlign: 'center' } },
              'Login required'
            ),
            confirmText: 'Login',
            onConfirm: () => {
              navigate('Login');
            }
          });
        }
      }
    };
  }, [actions, loginStatus]);

  const { run } = useRxAsync(request, {
    defer: true,
    onSuccess: actionConext.list
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
                catchError(error => {
                  toaster.apiError(`Failed to ${action} favourite`, error);
                  return empty();
                })
              );
            })
          );
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, [actions]);

  return React.createElement<ProviderProps<State>>(
    StateContext.Provider,
    { value: state },
    React.createElement<ProviderProps<Actions>>(
      ActionsContext.Provider,
      { value: actionConext },
      children
    )
  );
}

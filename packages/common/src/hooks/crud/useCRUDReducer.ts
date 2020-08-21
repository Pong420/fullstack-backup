/* eslint-disable @typescript-eslint/ban-types */

import { useState, useEffect, useReducer, useRef, useMemo } from 'react';
import { Subject } from 'rxjs';
import { createCRUDReducer, CreateCRUDReducerOptions } from './crudReducer';
import { AllowedNames, createCRUDActionsCreators } from './crudActions';
import { bindDispatch } from './bindDispatch';

export function createUseCRUDReducer<
  I extends {},
  K extends AllowedNames<I, string>
>(key: K, options?: CreateCRUDReducerOptions) {
  const [intialState, reducer] = createCRUDReducer<I, K>(key, options);
  return function useCRUDReducer() {
    const [state, dispatch] = useReducer(reducer, intialState);
    const { current: actions } = useRef({
      dispatch,
      ...bindDispatch(createCRUDActionsCreators<I, K>(), dispatch)
    });
    return [state, actions] as const;
  };
}

class Store<T> {
  value: T;
  constructor(value: T) {
    this.value = value;
  }
  getState(): T {
    return this.value;
  }
  setState(value: T) {
    this.value = value;
  }
}

type EqualityFn<T> = (oldState: T, newState: T) => boolean;
type Selector<I, O> = (state: I) => O;

export function createUseRxCRUDReducer<
  I extends {},
  K extends AllowedNames<I, string>
>(key: K, options?: CreateCRUDReducerOptions) {
  const [crudState, reducer] = createCRUDReducer<I, K>(key, options);
  const subject = new Subject<typeof crudState>();
  const store = new Store(crudState);

  function createSelector<O>(
    selector: Selector<typeof crudState, O>,
    equalityFn: EqualityFn<O> = () => false
  ) {
    return function useSelector() {
      const [state, setState] = useState(store.getState());
      useEffect(() => {
        const subscription = subject.subscribe(newState => {
          if (!equalityFn(selector(state), selector(newState))) {
            setState(newState);
          }
        });
        return () => subscription.unsubscribe();
      }, [state]);

      return selector(state);
    };
  }

  function useCRUDReducer() {
    const [state, dispatch] = useReducer(reducer, crudState);
    const actions = useMemo(() => {
      const dispatch$: typeof dispatch = payload => {
        dispatch(payload);

        const newState = reducer(store.getState(), payload);
        store.setState(newState);
        subject.next(newState);
      };
      return bindDispatch(createCRUDActionsCreators<I, K>(), dispatch$);
    }, [dispatch]);

    return [state, actions] as const;
  }

  return [useCRUDReducer, createSelector, subject, store] as const;
}

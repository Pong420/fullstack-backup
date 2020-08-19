import { useReducer, useRef, useMemo } from 'react';
import { Subject } from 'rxjs';
import { createCRUDReducer } from './crudReducer';
import { AllowedNames, createCRUDActionsCreators } from './crudActions';
import { bindDispatch } from './bindDispatch';
import { createPaginatedCRUDActionsCreators } from './paginatedCRUDActions';
import { createPaginatedCRUDReducer } from './paginatedCRUDReducer';

export function createUseCRUDReducer<
  I extends {},
  K extends AllowedNames<I, string>
>(key: K) {
  const [intialState, reducer] = createCRUDReducer<I, K>(key);
  return function useCRUDReducer() {
    const [state, dispatch] = useReducer(reducer, intialState);
    const { current: actions } = useRef({
      dispatch,
      ...bindDispatch(createCRUDActionsCreators<I, K>(), dispatch)
    });
    return [state, actions] as const;
  };
}

export function createUsePaginateCRUDReducer<
  I extends {},
  K extends AllowedNames<I, string>
>(key: K) {
  const [intialState, reducer] = createPaginatedCRUDReducer<I, K>(key);
  return function useCRUDReducer() {
    const [state, dispatch] = useReducer(reducer, intialState);
    const { current: actions } = useRef({
      dispatch,
      ...bindDispatch(createPaginatedCRUDActionsCreators<I, K>(), dispatch)
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

export function createUseRxCRUDReducer<
  I extends {},
  K extends AllowedNames<I, string>
>(key: K) {
  let [crudState, reducer] = createCRUDReducer<I, K>(key);
  const subject = new Subject<typeof crudState>();
  const store = new Store(crudState);

  function useCRUDReducer() {
    const [state, dispatch] = useReducer(reducer, crudState);
    const actions = useMemo(() => {
      const dispatch$: typeof dispatch = payload => {
        dispatch(payload);

        const newState = reducer(store.getState(), payload);
        store.setState(newState);
        subject.next(newState);
      };
      return bindDispatch(
        createPaginatedCRUDActionsCreators<I, K>(),
        dispatch$
      );
    }, [dispatch]);

    return [state, actions] as const;
  }

  return [subject, store, useCRUDReducer] as const;
}

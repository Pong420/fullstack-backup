import { useReducer, useRef } from 'react';
import { createCRUDReducer } from './crudReducer';
import { AllowedNames, createCRUDActionsCreators } from './crudActions';
import { bindDispatch } from './bindDispatch';

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

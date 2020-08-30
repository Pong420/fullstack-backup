/* eslint-disable @typescript-eslint/ban-types */

import { useReducer, useRef } from 'react';
import {
  CRUDState,
  createCRUDReducer,
  CreateCRUDReducerOptions
} from './crudReducer';
import {
  AllowedNames,
  createCRUDActionsCreators,
  CRUDActionCreators
} from './crudActions';
import { bindDispatch, Dispatched } from './bindDispatch';

export type UseCRUDReducer<
  I extends {},
  K extends AllowedNames<I, string>,
  Prefill extends boolean = true
> = () => [CRUDState<I, Prefill>, Dispatched<CRUDActionCreators<I, K>>];

export function createUseCRUDReducer<
  I extends {},
  K extends AllowedNames<I, string>
>(
  key: K,
  options: CreateCRUDReducerOptions & { prefill: false }
): UseCRUDReducer<I, K, false>;

export function createUseCRUDReducer<
  I extends {},
  K extends AllowedNames<I, string>
>(key: K, options?: CreateCRUDReducerOptions): UseCRUDReducer<I, K, true>;

export function createUseCRUDReducer<
  I extends {},
  K extends AllowedNames<I, string>
>(key: K, options?: CreateCRUDReducerOptions): UseCRUDReducer<I, K, boolean> {
  const [intialState, reducer] = createCRUDReducer<I, K>(key, options);
  return function useCRUDReducer() {
    const [state, dispatch] = useReducer(reducer, intialState);
    const { current: actions } = useRef({
      dispatch,
      ...bindDispatch(createCRUDActionsCreators<I, K>(), dispatch)
    });
    return [state, actions];
  };
}

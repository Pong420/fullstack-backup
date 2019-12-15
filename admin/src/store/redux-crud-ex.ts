import {
  getCRUDActionCreator,
  createCRUDReducer,
  CRUDActionsTypes,
  CRUDActionsMap,
  CRUDState,
  CRUDActions,
  CreateCRUDReducerOptions,
  paginationSelector,
  PaginationSelectorReturnType
} from '@pong420/redux-crud';
import { matchPath } from 'react-router-dom';
import { AllowedNames } from '../typings';
import qs from 'qs';

export interface CRUDStateEx<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>
> extends CRUDState<I, K> {
  search?: string;
}

interface Search {
  type: string;
  sub: 'SEARCH';
  payload: string;
}

export type CRUDActionsEx<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>
> = CRUDActions<I, K> | Search;

export interface CreateCRUDReducerOptionsEx<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>,
  A extends Record<CRUDActionsTypes | string, string>
> extends CreateCRUDReducerOptions<I, K, A> {
  path: string;
}

export type PaginationAndSearchReturnType<
  S extends CRUDStateEx<any, any>
> = PaginationSelectorReturnType<S> & { search?: string };

export function getCRUDActionCreatorEx<
  Types extends Record<keyof Actions, string>,
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>,
  Actions extends CRUDActionsMap<I, K> = CRUDActionsMap<I, K>
>() {
  return {
    SEARCH: (type: Types[keyof Types]) => (
      payload: Search['payload']
    ): Search => ({
      sub: 'SEARCH',
      type,
      payload
    }),
    ...getCRUDActionCreator<Types, I, K, Actions>()
  };
}

export function createCRUDReducerEx<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>,
  A extends Record<CRUDActionsTypes | string, string> = any
>({ path, ...props }: CreateCRUDReducerOptionsEx<I, K, A>) {
  const { crudInitialState, crudReducer } = createCRUDReducer<I, K, A>(props);

  const match = !!matchPath(window.location.pathname, { path, exact: true });
  const params: Record<string, string | undefined> = match
    ? qs.parse(window.location.search.slice(1))
    : {};

  let pageNo = Number(params.pageNo);
  pageNo = isNaN(pageNo) ? 1 : pageNo;

  const crudInitialStateEx: CRUDStateEx<I, K> = {
    ...crudInitialState,
    pageNo,
    search: params.search
  };

  function crudReducerEx(
    state = crudInitialStateEx,
    action: CRUDActionsEx<I, K>
  ): CRUDStateEx<I, K> {
    if (props.actions && props.actions[action.sub] !== action.type) {
      return state;
    }

    switch (action.sub) {
      case 'SEARCH':
        return { ...crudInitialState, pageNo: 1, search: action.payload };
      default:
        return crudReducer(state, action);
    }
  }

  return { crudInitialStateEx, crudReducerEx };
}

export function paginationAndSearchSelector<
  S extends CRUDStateEx<any, any> = CRUDStateEx<any, any>
>({ search, ...reset }: S): PaginationAndSearchReturnType<S> {
  return {
    search,
    ...paginationSelector<S>(reset as any)
  };
}

export * from '@pong420/redux-crud';

import {
  createCRUDReducer,
  paginationSelector,
  CRUDState,
  CRUDActions,
  CRUDActionsTypes,
  CreateCRUDReducerOptions,
  AllowedNames,
  PaginationSelectorReturnType
} from '@pong420/redux-crud';
import { LocationChangeAction, LOCATION_CHANGE } from 'connected-react-router';
import qs from 'qs';

export * from '@pong420/redux-crud';

export interface CRUDStateEx<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>
> extends CRUDState<I, K> {
  search?: string;
  pathname?: string;
}

export type PaginationSelectorReturnTypeEx<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>
> = PaginationSelectorReturnType<CRUDState<I, K>> & { search?: string };

function isLocationChangeAction(action: any): action is LocationChangeAction {
  return action.type === LOCATION_CHANGE;
}

function parsePageNo(payload: any) {
  const pageNo = Number(payload);
  return isNaN(pageNo) ? 1 : pageNo;
}

export const paginationSelectorEx = <
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>
>({
  search,
  ...state
}: CRUDStateEx<I, K>): PaginationSelectorReturnTypeEx<I, K> => {
  return { ...paginationSelector<CRUDState<I, K>>(state), search };
};

export function createCRUDReducerEx<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>,
  A extends Record<CRUDActionsTypes | string, string> = Record<
    CRUDActionsTypes | string,
    string
  >
>({ ...options }: CreateCRUDReducerOptions<I, K, A>) {
  const { crudInitialState, crudReducer } = createCRUDReducer<I, K, A>(options);

  const initialState: CRUDStateEx<I, K> = {
    ...crudInitialState,
    search: qs.parse(window.location.search.slice(1)).search,
    pathname: window.location.pathname.slice(
      (process.env.PUBLIC_URL || '').length
    )
  };

  function reducer(
    state = initialState,
    action: CRUDActions<I, K, A> | LocationChangeAction
  ): CRUDStateEx<I, K> {
    if (isLocationChangeAction(action)) {
      return (() => {
        const { location } = action.payload;
        const params: { search?: string; pageNo?: string } = qs.parse(
          location.search.slice(1)
        );
        const leave = location.pathname !== state.pathname;
        const searchChanged = params.search !== state.search;

        if (leave) {
          return {
            ...initialState,
            pathname: location.pathname,
            search: undefined,
            pageNo: 1
          };
        }

        if (searchChanged) {
          return {
            ...initialState,
            search: params.search,
            pageNo: 1
          };
        }

        return {
          ...state,
          search: params.search,
          pageNo: parsePageNo(params.pageNo)
        };
      })();
    }

    return { ...state, ...crudReducer(state, action) };
  }

  return [initialState, reducer] as const;
}

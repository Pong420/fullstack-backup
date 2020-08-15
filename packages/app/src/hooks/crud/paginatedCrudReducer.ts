import { Reducer } from 'react';
import { AllowedNames } from './crudActions';
import { createCRUDReducer, CRUDState } from './crudReducer';
import { PaginatedCRUDActions } from './paginatedCrudActions';

export interface PaginatedCRUDState<I extends Record<string, unknown>>
  extends CRUDState<I> {
  page: number;
  pageSize: number;
  total: number;
  params: Record<string, unknown>;
}

type ReturnCreatePaginatedCURDReducer<
  I extends {},
  K extends AllowedNames<I, string>
> = [
  PaginatedCRUDState<I>,
  Reducer<PaginatedCRUDState<I>, PaginatedCRUDActions<I, K>>
];

export function createPaginatedCrudReducer<
  I extends {},
  K extends AllowedNames<I, string>
>(key: K): ReturnCreatePaginatedCURDReducer<I, K> {
  const [crudState, crudReducer] = createCRUDReducer<I, K>(key);
  const defaultState: PaginatedCRUDState<I> = {
    ...crudState,
    page: 1,
    pageSize: 10,
    total: 0,
    params: {}
  };

  function reducer(
    state: PaginatedCRUDState<I> = defaultState,
    action: PaginatedCRUDActions<I, K>
  ): PaginatedCRUDState<I> {
    switch (action.type) {
      // add location change action

      case 'PAGINATE':
        return (() => {
          const { data, page, total } = Array.isArray(action.payload)
            ? { total: action.payload.length, data: action.payload, page: 1 }
            : action.payload;

          const start = (page - 1) * state.pageSize;
          const insert = <T1, T2>(arr: T1[], ids: T2[]) => [
            ...arr.slice(0, start),
            ...ids,
            ...arr.slice(start + state.pageSize)
          ];

          const { list, ids, byIds } = data.reduce(
            (state, payload) => crudReducer(state, { type: 'CREATE', payload }),
            { list: [], byIds: {}, ids: [] } as CRUDState<I>
          );

          return {
            ...state,
            page,
            total,
            ids: insert(state.ids, ids).slice(0, total),
            list: insert(state.list, list).slice(0, total),
            byIds: {
              ...state.byIds,
              ...byIds
            }
          };
        })();

      default:
        return {
          ...state,
          ...crudReducer(state, action)
        };
    }
  }

  return [defaultState, reducer];
}

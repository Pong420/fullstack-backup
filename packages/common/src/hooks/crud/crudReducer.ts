/* eslint-disable @typescript-eslint/ban-types */

import { AllowedNames, CRUDActions } from './crudActions';

export interface CRUDState<I extends {}> {
  byIds: Record<string, I>;
  ids: string[];
  list: I[];
  pageNo: number;
  pageSize: number;
  total: number;
  params: any;
}

export type CRUDReducer<I extends {}, K extends AllowedNames<I, string>> = (
  state: CRUDState<I>,
  action: CRUDActions<I, K>
) => CRUDState<I>;

export function createCRUDReducer<
  I extends {},
  K extends AllowedNames<I, string>
>(key: K) {
  const defaultState: CRUDState<I> = {
    byIds: {},
    ids: [],
    list: [],
    pageNo: 1,
    pageSize: 10,
    total: 0,
    params: {}
  };

  const reducer: CRUDReducer<I, K> = (state = defaultState, action) => {
    switch (action.type) {
      case 'PAGINATE':
        return (() => {
          const { data, pageNo, total } = Array.isArray(action.payload)
            ? { total: action.payload.length, data: action.payload, pageNo: 1 }
            : action.payload;

          return {
            ...state,
            ...data.reduce(
              (state, payload) => reducer(state, { type: 'CREATE', payload }),
              pageNo === 1 ? defaultState : state
            ),
            total,
            pageNo
          };
        })();

      case 'LIST':
        return (() => {
          return action.payload.reduce(
            (state, payload) => reducer(state, { type: 'CREATE', payload }),
            defaultState
          );
        })();

      case 'CREATE':
        return (() => {
          const id: string = action.payload[key] as any;
          return {
            ...state,
            byIds: { ...state.byIds, [id]: action.payload },
            list: [...state.list, action.payload],
            ids: [...state.ids, id]
          };
        })();

      case 'UPDATE':
        return (() => {
          const id = action.payload[key] as string;
          const updated = { ...state.byIds[id], ...action.payload };
          const index = state.ids.indexOf(id);
          return index === -1
            ? state
            : {
                ...state,
                byIds: { ...state.byIds, [id]: updated },
                list: [
                  ...state.list.slice(0, index),
                  updated,
                  ...state.list.slice(index + 1)
                ]
              };
        })();

      case 'DELETE':
        return (() => {
          const id = action.payload[key];
          const index = state.ids.indexOf(id);
          const { [id]: deleted, ...byIds } = state.byIds;
          return {
            ...state,
            byIds,
            ids: removeFromArray(state.ids, index),
            list: removeFromArray(state.list, index)
          };
        })();

      case 'PARAMS':
        const { pageNo, pageSize, ...params } = action.payload;
        const toNum = (value: unknown, num: number) =>
          isNaN(Number(value)) ? num : Number(value);

        return {
          ...state,
          pageNo: toNum(pageNo, state.pageNo),
          pageSize: toNum(pageSize, state.pageSize),
          params
        };

      case 'RESET':
        return defaultState;

      default:
        return state;
    }
  };

  return [defaultState, reducer] as const;
}

export function removeFromArray<T>(arr: T[], index: number) {
  return index < 0 ? arr : [...arr.slice(0, index), ...arr.slice(index + 1)];
}

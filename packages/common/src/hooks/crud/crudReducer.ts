/* eslint-disable @typescript-eslint/ban-types */

import { AllowedNames, CRUDActions } from './crudActions';

export interface CRUDState<I extends {}, Prefill extends boolean = true> {
  byIds: Record<string, I>;
  ids: Prefill extends true ? Array<string | null> : string[];
  list: Prefill extends true ? Array<I | Partial<I>> : I[];
  pageNo: number;
  pageSize: number;
  total: number;
  params: any;
}

export type CRUDReducer<
  I extends {},
  K extends AllowedNames<I, string>,
  Prefill extends boolean = true
> = (
  state: CRUDState<I, Prefill>,
  action: CRUDActions<I, K>
) => CRUDState<I, Prefill>;

export interface CreateCRUDReducerOptions {
  prefill?: boolean;
}

export function createCRUDReducer<
  I extends {},
  K extends AllowedNames<I, string>
>(
  key: K,
  options: CreateCRUDReducerOptions & { prefill: false }
): [CRUDState<I, false>, CRUDReducer<I, K, false>];

export function createCRUDReducer<
  I extends {},
  K extends AllowedNames<I, string>
>(
  key: K,
  options?: CreateCRUDReducerOptions
): [CRUDState<I, true>, CRUDReducer<I, K, true>];

export function createCRUDReducer<
  I extends {},
  K extends AllowedNames<I, string>
>(
  key: K,
  options: CreateCRUDReducerOptions = {}
): [CRUDState<I, boolean>, CRUDReducer<I, K, boolean>] {
  const defaultState: CRUDState<I, boolean> = {
    byIds: {},
    ids: [],
    list: [],
    pageNo: 1,
    pageSize: 10,
    total: 0,
    params: {}
  };

  const { prefill = true } = options;

  const reducer: CRUDReducer<I, K, boolean> = (
    state = defaultState,
    action
  ) => {
    switch (action.type) {
      case 'PAGINATE':
        return (() => {
          const { data, pageNo, total } = Array.isArray(action.payload)
            ? { total: action.payload.length, data: action.payload, pageNo: 1 }
            : action.payload;

          if (prefill === false) {
            return reducer(state, { type: 'LIST', payload: data });
          }

          const start = (pageNo - 1) * state.pageSize;

          const insert = <T1, T2>(arr: T1[], ids: T2[]) => {
            return [
              ...arr.slice(0, start),
              ...ids,
              ...arr.slice(start + pageSize)
            ];
          };

          const { list, ids, byIds } = reducer(defaultState, {
            type: 'LIST',
            payload: data
          });

          return {
            ...state,
            total,
            pageNo,
            byIds: {
              ...state.byIds,
              ...byIds
            },
            ids: insert(
              [...state.ids, ...new Array<null>(total).fill(null)],
              ids
            ).slice(0, total),
            list: insert(
              [...state.list, ...new Array<Partial<I>>(total).fill({})],
              list
            ).slice(0, total)
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
          typeof value === 'undefined' || isNaN(Number(value))
            ? num
            : Number(value);

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

  return [defaultState, reducer];
}

export function removeFromArray<T>(arr: T[], index: number) {
  return index < 0 ? arr : [...arr.slice(0, index), ...arr.slice(index + 1)];
}

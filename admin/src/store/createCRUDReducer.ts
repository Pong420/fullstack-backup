import {
  TransformDataById,
  transformDatabyId
} from '../utils/transformDatabyId';
import { AllowedNames, ValueOf } from '../typings';
import qs from 'qs';

interface Props<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>
> {
  key: I[K];
  pageSize?: number;
}

export interface CRUDState<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>
> {
  byIds: TransformDataById<I, K, I>['byIds'];
  ids: Array<I[K] | null>;
  list: Partial<I>[];
  pageNo: number;
}

interface PagePayload<T> {
  data: T[];
  total: number;
  pageNo: number;
}

export type CRUDActionsTypes<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>
> = {
  RESET: { type: 'RESET' };
  ADD: { type: 'ADD'; payload: I };
  PAGINATE: { type: 'PAGINATE'; payload: PagePayload<I> };
  SET_PAGE: { type: 'SET_PAGE'; payload: number };
  REMOVE: { type: 'REMOVE'; payload: Pick<I, K> };
  UPDATE: { type: 'UPDATE'; payload: Pick<I, K> & Partial<I> };
};

export type CRUDActions<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>
> = ValueOf<CRUDActionsTypes<I, K>>;

export function isPagePayload<T>(obj: any): obj is PagePayload<T> {
  return !!(
    obj &&
    typeof obj === 'object' &&
    obj.hasOwnProperty('pageNo') &&
    obj.hasOwnProperty('data')
  );
}

function removeFromArray<T>(arr: T[], index: number) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export function createCRUDReducer<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>
>({ key, pageSize = 10 }: Props<I, K>) {
  const { pageNo } = qs.parse(window.location.search.slice(1));

  const crudInitialState: CRUDState<I, K> = {
    ids: [],
    list: [],
    byIds: {} as CRUDState<I, K>['byIds'],
    pageNo: pageNo ? Number(pageNo) : 1
  };

  function crudReducer(
    state = crudInitialState,
    action: CRUDActions<I, K>
  ): CRUDState<I, K> {
    switch (action.type) {
      case 'RESET':
        return { ...crudInitialState, pageNo: 1 };

      case 'SET_PAGE':
        return { ...state, pageNo: action.payload };

      case 'ADD':
        return (() => {
          const id = action.payload[key];

          const total = state.list.length + 1;
          const full = state.list.length % pageSize === 0;

          return {
            ...state,
            ids: [...state.ids, id],
            list: [...state.list, action.payload],
            byIds: { ...state.byIds, [id]: action.payload },
            pageNo: full ? Math.floor(total / pageSize) + 1 : state.pageNo
          };
        })();

      case 'PAGINATE':
        return (() => {
          const { pageNo, data, total } = action.payload;
          const { byIds, ids } = transformDatabyId<I, K, I>(data, key);
          const start = (pageNo - 1) * pageSize;
          const insert = <T>(arr: T[], ids: T[]) => [
            ...arr.slice(0, start),
            ...ids,
            ...arr.slice(start + pageSize)
          ];

          return {
            ...state,
            ids: insert(
              [
                ...state.ids,
                ...(new Array(total).fill(null) as Array<null>)
              ].slice(0, total),
              ids
            ),
            list: insert(
              [
                ...state.list,
                ...(new Array(total).fill({}) as Partial<I>[])
              ].slice(0, total),
              data
            ),
            byIds: {
              ...state.byIds,
              ...byIds
            }
          };
        })();

      case 'REMOVE':
        return (() => {
          const { [key]: id } = action.payload;
          const index = state.ids.indexOf(id);

          const byIds = { ...state.byIds };
          delete byIds[id];

          const total = state.list.length - 1;

          return {
            ...state,
            ids: removeFromArray(state.ids, index),
            list: removeFromArray(state.list, index),
            byIds,
            pageNo: Math.min(Math.ceil(total / pageSize), state.pageNo)
          };
        })();

      case 'UPDATE':
        return (() => {
          const id: I[K] = action.payload[key] as any;
          const index = state.ids.indexOf(id);

          const newUser = {
            ...state.byIds[id],
            ...action.payload
          };
          return {
            ...state,
            byIds: {
              ...state.byIds,
              [id]: newUser
            },
            list: [
              ...state.list.slice(0, index),
              newUser,
              ...state.list.slice(index + 1)
            ]
          };
        })();

      default:
        return state;
    }
  }

  return { crudInitialState, crudReducer };
}

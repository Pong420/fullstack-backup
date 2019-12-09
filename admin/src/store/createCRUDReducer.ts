import {
  TransformDataById,
  transformDatabyId
} from '../utils/transformDatabyId';
import { AllowedNames, ValueOf } from '../typings';

export interface CRUDState<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>
> {
  byIds: TransformDataById<I, K, I>['byIds'];
  ids: Array<I[K] | null>;
  list: Array<I | Partial<I>>;
  pageNo: number;
  pageSize: number;
}

interface PagePayload<T> {
  data: T[];
  total: number;
  pageNo: number;
}

export type CRUDActionsMap<
  I extends Record<PropertyKey, any> = any,
  K extends AllowedNames<I, PropertyKey> = any
> = {
  RESET: { type: string; sub: 'RESET' };
  CREATE: { type: string; sub: 'CREATE'; payload: I };
  DELETE: { type: string; sub: 'DELETE'; payload: Pick<I, K> };
  UPDATE: { type: string; sub: 'UPDATE'; payload: Pick<I, K> & Partial<I> };
  PAGINATE: { type: string; sub: 'PAGINATE'; payload: PagePayload<I> };
  SET_PAGE: { type: string; sub: 'SET_PAGE'; payload: number };
};

export type CRUDActionsTypes = keyof CRUDActionsMap<any, any>;

export type CRUDActions<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>
> = ValueOf<CRUDActionsMap<I, K>>;

interface Props<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>
> extends Partial<CRUDState<I, K>> {
  key: I[K];
}

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
>({ key, pageSize = 10, ...initialState }: Props<I, K>) {
  const match = window.location.search.match(/(?<=pageNo=)(.*)(?=(&))/g);
  let pageNo = Number(match ? match[0] : 1);
  pageNo = isNaN(pageNo) ? 1 : pageNo;

  const crudInitialState: CRUDState<I, K> = {
    ids: [],
    list: [],
    byIds: {} as CRUDState<I, K>['byIds'],
    pageNo,
    pageSize,
    ...initialState
  };

  function crudReducer(
    state = crudInitialState,
    action: CRUDActions<I, K>
  ): CRUDState<I, K> {
    switch (action.sub) {
      case 'RESET':
        return { ...crudInitialState, pageNo: 1 };

      case 'SET_PAGE':
        return { ...state, pageNo: action.payload };

      case 'CREATE':
        return (() => {
          const id = action.payload[key];

          return {
            ...state,
            ids: [...state.ids, id],
            list: [...state.list, action.payload],
            byIds: { ...state.byIds, [id]: action.payload },
            pageNo: Math.floor(state.list.length / pageSize) + 1
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

      case 'DELETE':
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

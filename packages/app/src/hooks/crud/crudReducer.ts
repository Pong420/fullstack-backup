import { AllowedNames, CRUDActions } from './crudActions';

export interface CRUDState<I extends Record<string, unknown>> {
  byIds: Record<string, I>;
  ids: string[];
  list: I[];
}

export function createCRUDReducer<
  I extends Record<string, unknown>,
  K extends AllowedNames<I, string>
>(key: K) {
  const defaultState: CRUDState<I> = {
    byIds: {},
    ids: [],
    list: []
  };

  function reducer(
    state: CRUDState<I> = defaultState,
    action: CRUDActions<I, K>
  ): CRUDState<I> {
    switch (action.type) {
      case 'LIST':
        return (() => {
          return action.payload.reduce(
            (state, payload) => reducer(state, { type: 'CREATE', payload }),
            defaultState
          );
        })();

      case 'CREATE':
        return (() => {
          const id = action.payload[key] as string;
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

      case 'RESET':
        return defaultState;

      default:
        return state;
    }
  }

  return [defaultState, reducer] as const;
}

export function removeFromArray<T>(arr: T[], index: number) {
  return index < 0 ? arr : [...arr.slice(0, index), ...arr.slice(index + 1)];
}

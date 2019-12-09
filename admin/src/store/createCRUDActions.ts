import { CRUDActionsMap } from './createCRUDReducer';
import { AllowedNames } from '../typings';

export type UnionCRUDActions<
  T extends Record<string, (...args: any[]) => any>
> = ReturnType<T[keyof T]>;

export function getCRUDActionCreator<
  Types extends Record<keyof Actions, string>,
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>,
  Actions extends CRUDActionsMap<I, K> = CRUDActionsMap<I, K>
>() {
  type Action<Key extends keyof Actions> = Actions[Key] extends {
    payload: any;
  }
    ? (
        payload: Actions[Key]['payload']
      ) => {
        type: Types[Key];
        sub: Key;
        payload: Actions[Key]['payload'];
      }
    : (payload?: undefined) => { type: Types[Key]; sub: Key };

  const keys: Array<keyof CRUDActionsMap<I, K>> = [
    'CREATE',
    'DELETE',
    'UPDATE',
    'PAGINATE',
    'SET_PAGE',
    'RESET'
  ];

  return keys.reduce(
    (acc, key) => {
      acc[key] = (type: Types[keyof Types]) =>
        ((payload?: any) => ({ type, payload, sub: key })) as any;
      return acc;
    },
    {} as {
      [Key in keyof CRUDActionsMap<I, K>]: (
        type: Types[keyof Types]
      ) => Action<Key>;
    }
  );
}

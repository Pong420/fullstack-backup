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
    type: string;
    payload: any;
  }
    ? (
        payload: Actions[Key]['payload']
      ) => {
        type: Types[Key];
        payload: Actions[Key]['payload'];
      }
    : (payload?: undefined) => { type: Types[Key] };

  return function<Key extends keyof Actions>(
    type: Types[keyof Types]
  ): Action<Key> {
    return ((payload?: any) => ({ type, payload })) as any;
  };
}

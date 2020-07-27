// https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
export type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};

export type AllowedNames<Base, Condition> = FilterFlags<
  Base,
  Condition
>[keyof Base];

export interface List<I extends Record<string, unknown>> {
  type: 'LIST';
  payload: I[];
}

export interface Create<I extends Record<string, unknown>> {
  type: 'CREATE';
  payload: I;
}

export type OnUpdate<
  I extends Record<string, unknown>,
  K extends AllowedNames<I, string>
> = (payload: Partial<I> & { [T in K]: string }) => void;

export interface Update<
  I extends Record<string, unknown>,
  K extends AllowedNames<I, string>
> {
  type: 'UPDATE';
  payload: Partial<I> & { [T in K]: string };
}

export interface Delete<
  I extends Record<string, unknown>,
  K extends AllowedNames<I, string>
> {
  type: 'DELETE';
  payload: { [T in K]: string };
}

export interface Reset {
  type: 'RESET';
}

export type CRUDActions<I extends {}, K extends AllowedNames<I, string>> =
  | List<I>
  | Create<I>
  | Update<I, K>
  | Delete<I, K>
  | Reset;

export function createCRUDActionsCreators<
  I extends Record<string, unknown>,
  K extends AllowedNames<I, string>
>() {
  return {
    list: (payload: List<I>['payload']): List<I> => ({
      type: 'LIST',
      payload
    }),
    create: (payload: Create<I>['payload']): Create<I> => ({
      type: 'CREATE',
      payload
    }),
    update: (payload: Update<I, K>['payload']): Update<I, K> => ({
      type: 'UPDATE',
      payload
    }),
    delete: (payload: Delete<I, K>['payload']): Delete<I, K> => ({
      type: 'DELETE',
      payload
    }),
    reset: (): Reset => ({ type: 'RESET' })
  };
}

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

export type ExtractAction<
  T1 extends { type: string },
  T2 extends T1['type']
> = T1 extends { type: T2 } ? T1 : never;

export type Creator<
  T1 extends { type: string; payload?: unknown }
> = ExtractAction<T1, T1['type']> extends { payload: any }
  ? (payload: ExtractAction<T1, T1['type']>['payload']) => T1
  : (payload?: ExtractAction<T1, T1['type']>['payload']) => T1;

export type CRUDActionCreators<
  I extends {},
  K extends AllowedNames<I, string>
> = {
  list: Creator<List<I>>;
  create: Creator<Create<I>>;
  update: Creator<Update<I, K>>;
  delete: Creator<Delete<I, K>>;
  reset: Creator<Reset>;
};

export function createCRUDActionsCreators<
  I extends Record<string, unknown>,
  K extends AllowedNames<I, string>
>(): CRUDActionCreators<I, K> {
  return {
    list: payload => ({ type: 'LIST', payload }),
    create: payload => ({ type: 'CREATE', payload }),
    update: payload => ({ type: 'UPDATE', payload }),
    delete: payload => ({ type: 'DELETE', payload }),
    reset: () => ({ type: 'RESET' })
  };
}

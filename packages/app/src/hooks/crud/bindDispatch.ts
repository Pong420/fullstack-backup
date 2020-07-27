import { Dispatch as ReactDispatch } from 'react';

export interface AnyAction {
  type: string;
  [extraProps: string]: any;
}

interface ActionCreators {
  [k: string]: (...args: any[]) => AnyAction;
}

type Handler<A extends ActionCreators> = {
  [X in keyof A]: (...args: Parameters<A[X]>) => void;
};

export type ExtractAction<
  T1 extends { type: string },
  T2 extends T1['type']
> = T1 extends { type: T2 } ? T1 : never;

export type Action<
  T1 extends { type: string; payload?: unknown },
  T2 extends T1['type']
> = (payload: ExtractAction<T1, T2>['payload']) => void;

export function bindDispatch<A extends ActionCreators>(
  creators: A,
  dispatch: ReactDispatch<any>
) {
  const handler = {} as Handler<A>;
  for (const key in creators) {
    const creator = creators[key];
    handler[key] = (...args: Parameters<typeof creator>) => {
      dispatch(creator(...args));
    };
  }

  return handler;
}

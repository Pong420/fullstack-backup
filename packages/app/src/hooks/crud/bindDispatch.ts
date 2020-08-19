import { Dispatch as ReactDispatch } from 'react';

export interface AnyAction {
  type: string;
  [extraProps: string]: any;
}

export interface ActionCreators {
  [k: string]: (...args: any[]) => AnyAction;
}

export type Dispatched<A extends ActionCreators> = {
  [X in keyof A]: (...args: Parameters<A[X]>) => void;
};

export function bindDispatch<A extends ActionCreators>(
  creators: A,
  dispatch: ReactDispatch<any>
) {
  const handler = {} as Dispatched<A>;
  for (const key in creators) {
    const creator = creators[key];
    handler[key] = (...args: Parameters<typeof creator>) => {
      dispatch(creator(...args));
    };
  }

  return handler;
}

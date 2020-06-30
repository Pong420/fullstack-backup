import { useRef, Dispatch as ReactDispatch, useMemo } from 'react';
import { AnyAction, Dispatch } from 'redux';
import { useDispatch } from 'react-redux';

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

export type ActionsMap<T1 extends { type: string }> = {
  [K in T1['type']]: T1 extends { type: K } ? T1 : never;
};

export function bindDispatch<A extends ActionCreators>(
  creators: A,
  dispatch: Dispatch | ReactDispatch<any>
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

export function useActions<A extends ActionCreators>(creators: A): Handler<A> {
  const dispatch = useDispatch();
  const creatorsRef = useRef(creators);
  return useMemo(() => bindDispatch(creatorsRef.current, dispatch), [dispatch]);
}

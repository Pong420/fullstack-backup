/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useRef, Dispatch as ReactDispatch } from 'react';
import { AnyAction, Dispatch } from 'redux';
import { useDispatch } from 'react-redux';

interface ActionCreators {
  [k: string]: (...args: any[]) => AnyAction;
}

type Handler<A extends ActionCreators> = {
  [X in keyof A]: (...args: Parameters<A[X]>) => void;
};

export function withDispatch<A extends ActionCreators>(
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

  return useMemo(() => withDispatch(creatorsRef.current, dispatch), [dispatch]);
}

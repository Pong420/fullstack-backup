/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useRef } from 'react';
import { AnyAction } from 'redux';
import { useDispatch } from 'react-redux';

interface ActionCreators {
  [k: string]: (...args: any[]) => AnyAction;
}

type Handler<A extends ActionCreators> = {
  [X in keyof A]: (...args: Parameters<A[X]>) => void;
};

export function useActions<A extends ActionCreators>(creators: A): Handler<A> {
  const dispatch = useDispatch();
  const creatorsRef = useRef(creators);

  return useMemo(() => {
    const handler = {} as Handler<A>;
    const creators = creatorsRef.current;

    for (const key in creators) {
      const creator = creators[key];
      handler[key] = (...args: Parameters<typeof creator>) => {
        dispatch(creator(...args));
      };
    }

    return handler;
  }, [dispatch]);
}

import { Action } from 'redux';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';

interface Actions {
  [k: string]: (params?: any) => Action;
}

// https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never;

type GetFunction<Fn extends (params?: any) => any> = Parameters<
  Fn
>[0] extends undefined
  ? (() => void)
  : UnionToIntersection<Parameters<Fn>[0]> extends undefined
  ? ((params?: Parameters<Fn>[0]) => void)
  : ((params: Parameters<Fn>[0]) => void);

export function useActions<A extends Actions>(actions: A) {
  const dispatch = useDispatch();

  return useMemo(() => {
    const handler = {} as any;

    for (const key in actions) {
      handler[key] = (params?: any) => {
        dispatch(actions[key](params));
      };
    }

    return handler as {
      [Key in keyof A]: GetFunction<A[Key]>;
    };
  }, [actions, dispatch]);
}

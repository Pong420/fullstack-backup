import { useRef, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreators, Dispatched, bindDispatch } from './crud';

export type ActionsMap<T1 extends { type: string }> = {
  [K in T1['type']]: T1 extends { type: K } ? T1 : never;
};

export function useActions<A extends ActionCreators>(
  creators: A
): Dispatched<A> {
  const dispatch = useDispatch();
  const creatorsRef = useRef(creators);
  return useMemo(() => bindDispatch(creatorsRef.current, dispatch), [dispatch]);
}

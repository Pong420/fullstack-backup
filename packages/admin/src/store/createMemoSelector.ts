import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { OutputParametricSelector, ParametricSelector } from 'reselect';
import { RootState } from './reducers';

export const createMemoSelector = <P, R, C>(
  selector:
    | OutputParametricSelector<RootState, P, R, C>
    | ParametricSelector<RootState, P, R>
) => (props: P) => {
  const memoSelector = useMemo(() => selector, []);
  return useSelector((state: RootState) => memoSelector(state, props));
};

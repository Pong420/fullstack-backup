import { paginationSelector } from '@pong420/redux-crud';
import { RootState } from '../reducers';
import { Schema$Product } from '../../typings';

export const productPaginationSelector = ({ pageNo }: { pageNo?: number }) => (
  state: RootState
) =>
  paginationSelector({
    ...state.products,
    ...(pageNo && { pageNo })
  });

export const productSelector = (id: string) => (
  state: RootState
): Partial<Schema$Product> => {
  return id ? state.products.byIds[id] : {};
};

export const productSuggestSelector = (type: 'types' | 'tags') => (
  state: RootState
) => state.products[type];

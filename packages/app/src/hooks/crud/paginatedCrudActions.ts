import {
  CRUDActions,
  AllowedNames,
  createCRUDActionsCreators,
  CRUDActionCreators,
  Creator
} from './crudActions';

export type PaginatePayload<I> =
  | I[]
  | {
      data: I[];
      total: number;
      page: number;
    };

export interface Paginate<I extends Record<string, unknown>> {
  type: 'PAGINATE';
  payload: PaginatePayload<I>;
}

export type PaginatedCRUDActions<
  I extends {},
  K extends AllowedNames<I, string>
> = CRUDActions<I, K> | Paginate<I>;

export type PaginatedCRUDActionCreators<
  I extends {},
  K extends AllowedNames<I, string>
> = CRUDActionCreators<I, K> & {
  paginate: Creator<Paginate<I>>;
};

export function createPaginatedCRUDActionsCreators<
  I extends {},
  K extends AllowedNames<I, string>
>(): PaginatedCRUDActionCreators<I, K> {
  return {
    ...createCRUDActionsCreators<I, K>(),
    paginate: payload => ({ type: 'PAGINATE', payload })
  };
}

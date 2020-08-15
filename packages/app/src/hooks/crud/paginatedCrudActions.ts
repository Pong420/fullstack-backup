import {
  CRUDActions,
  AllowedNames,
  createCRUDActionsCreators
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

export function createPaginatedCRUDActionsCreators<
  I extends Record<string, unknown>,
  K extends AllowedNames<I, string>
>() {
  return {
    ...createCRUDActionsCreators<I, K>(),
    paginate: (payload: Paginate<I>['payload']): Paginate<I> => ({
      type: 'PAGINATE',
      payload
    })
  };
}

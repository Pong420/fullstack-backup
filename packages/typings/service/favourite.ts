import { Timestamp, Pagination, PaginateApiResponse, ApiResponse } from './';
import { Schema$Product } from './products';

export enum FavouriteAction {
  Add = 'add',
  Remove = 'remove'
}

export interface Schema$Favourite extends Timestamp {
  id: string;
  user: string;
  product: Schema$Product | null;
}

export interface Param$GetFavourites extends Pagination {
  id?: string;
  user?: string;
}

export interface Param$ToggleFavourite {
  product: string;
  action: FavouriteAction;
}

export interface Param$Favourite {
  id: string;
}

export type Response$GetFavourites = PaginateApiResponse<Schema$Favourite>;
export type Response$Favourite = ApiResponse<Schema$Favourite>;

import { Timestamp, Pagination, PaginateApiResponse, ApiResponse } from './';
import { Schema$Product } from './products';

export interface Schema$Favourite extends Timestamp, Pagination {
  id: string;
  user: string;
  product: Schema$Product;
}

export interface Param$GetFavourite {
  id?: string;
  user?: string;
}

export interface Param$ToggleFavourite {
  product: string;
}

export interface Param$Favourite {
  id: string;
}

export type Response$GetFavourites = PaginateApiResponse<Schema$Favourite>;
export type Response$Favourite = ApiResponse<Schema$Favourite>;

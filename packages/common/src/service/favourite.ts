import { api } from './api';
import {
  Param$Favourite,
  Param$GetFavourites,
  Param$ToggleFavourite,
  Response$Favourite,
  Response$GetFavourites
} from '@fullstack/typings';
import { paths } from '../constants';

export function getFavourites(params?: Param$GetFavourites) {
  return api.get<Response$GetFavourites>(paths.get_favourites, { params });
}

export function toggleFavourite(params: Param$ToggleFavourite) {
  return api.post<Response$Favourite | null | undefined>(
    paths.toggle_favourite.generatePath(params)
  );
}

export function deleteFavourite({ id }: Param$Favourite) {
  return api.delete(paths.delete_address.generatePath({ id }));
}

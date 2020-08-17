import { SuperAgentRequest } from 'superagent';
import { paths } from '@fullstack/common/constants';
import { Param$Favourite } from '@fullstack/typings';
import { CreateFavouriteDto } from '../../src/favourite/dto/create-favourite.dto';

export function getFavourites(token: string): SuperAgentRequest {
  return request
    .get(paths.get_favourites)
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function createFavourite(
  token: string,
  dto: CreateFavouriteDto
): SuperAgentRequest {
  return request
    .post(paths.create_favourite)
    .set('Authorization', `bearer ${token}`)
    .send(dto);
}

export function deleteFavourite(
  token: string,
  { id }: Param$Favourite
): SuperAgentRequest {
  return request
    .delete(paths.delete_favourite.generatePath({ id }))
    .set('Authorization', `bearer ${token}`);
}

import { SuperAgentRequest } from 'superagent';
import { paths } from '@fullstack/common/constants';
import { Param$ToggleFavourite } from '@fullstack/typings';

export function getFavourites(token: string): SuperAgentRequest {
  return request
    .get(paths.get_favourites)
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function toggleFavourite(
  token: string,
  params: Param$ToggleFavourite
): SuperAgentRequest {
  return request
    .post(paths.toggle_favourite.generatePath(params))
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function deleteFavourite(token: string, id: string): SuperAgentRequest {
  return request
    .delete(paths.delete_favourite.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send();
}

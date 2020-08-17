import { SuperAgentRequest } from 'superagent';
import { paths } from '@fullstack/common/constants';

export function getFavourites(token: string): SuperAgentRequest {
  return request
    .get(paths.get_favourites)
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function toggleFavourite(
  token: string,
  product: string
): SuperAgentRequest {
  return request
    .post(paths.toggle_favourite.generatePath({ product }))
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function deleteFavourite(token: string, id: string): SuperAgentRequest {
  return request
    .delete(paths.delete_favourite.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send();
}

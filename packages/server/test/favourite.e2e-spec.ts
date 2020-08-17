import { HttpStatus } from '@nestjs/common';
import { Schema$Favourite, UserRole } from '@fullstack/typings';
import {
  getFavourites,
  createFavourite,
  deleteFavourite
} from './service/favourite';
import { setupUsers } from './utils/setupUsers';
import { setupProducts } from './utils/setupProducts';
import { getToken } from './service/auth';
import { createUser } from './service/users';

describe('FavouriteController (e2e)', () => {
  beforeAll(async () => {
    await setupUsers();
    await setupProducts([{}, {}, {}]);
  });

  describe('(Get) Get Favourites', () => {
    let favourites: Schema$Favourite[] = [];

    beforeAll(async () => {
      favourites = await Promise.all([
        ...products.map(({ id }) =>
          createFavourite(clientToken, { product: id })
        ),
        // this make sure client will only get its favourite
        createFavourite(adminToken, { product: products[0].id })
      ]).then(responses => responses.map(res => res.body.data));
    });

    it('success', async () => {
      const response = await getFavourites(clientToken);
      expect(response.status).toBe(HttpStatus.OK);

      expect(response.body.data.data.length).toBe(products.length);
      expect(response.body.data.total).toBe(products.length);
      expect(response.body.data.data).toSatisfyAll(
        product => typeof product.user === 'undefined'
      );
      expect(response.body.data.data).toIncludeAllMembers(
        favourites.slice(0, products.length)
      );
    });
  });

  describe('(POST) Create Favourite', () => {
    it('success', async () => {
      const product = products[0];
      const response = await createFavourite(clientToken, {
        product: product.id
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.data.user).toBeUndefined();
      expect(response.body.data.product).toBeObject();
      expect(response.body.data.product._id).toBeUndefined();
    });
  });

  describe('(DEL) Delete Favourite', () => {
    let favourite: Schema$Favourite;

    beforeEach(async () => {
      const response = await createFavourite(clientToken, {
        product: products[0].id
      });
      favourite = response.body.data;
    });

    it('success', async () => {
      let response = await deleteFavourite(clientToken, {
        id: favourite.id
      });

      expect(response.status).toBe(HttpStatus.OK);

      response = await getFavourites(clientToken);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.data).not.toIncludeSameMembers([favourite]);
    });

    it('cannot delete by other clients', async () => {
      const otherClientToken = await getToken(
        createUser(adminToken, { role: UserRole.CLIENT })
      );

      let response = await deleteFavourite(otherClientToken, {
        id: favourite.id
      });

      response = await getFavourites(clientToken);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.data).toIncludeAnyMembers([favourite]);
    });

    it('can be delete by admin', async () => {
      let response = await deleteFavourite(adminToken, {
        id: favourite.id
      });

      response = await getFavourites(clientToken);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.data).not.toIncludeAnyMembers([favourite]);
    });
  });
});

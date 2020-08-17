import { HttpStatus } from '@nestjs/common';
import { Schema$Favourite, UserRole, Schema$Product } from '@fullstack/typings';
import {
  getFavourites,
  toggleFavourite,
  deleteFavourite
} from './service/favourite';
import { setupUsers } from './utils/setupUsers';
import { setupProducts } from './utils/setupProducts';
import { getToken } from './service/auth';
import { createUser } from './service/users';

describe('FavouriteController (e2e)', () => {
  beforeAll(async () => {
    await setupUsers();
  });

  describe('(Get) Get Favourites', () => {
    let favourites: Schema$Favourite[] = [];
    let products: Schema$Product[] = [];

    beforeAll(async () => {
      products = await setupProducts([{}, {}, {}]);

      favourites = await Promise.all([
        ...products.map(product => toggleFavourite(client.token, product.id)),
        // this make sure client will only get its favourite
        toggleFavourite(admin.token, products[0].id)
      ]).then(responses => responses.map(res => res.body.data));
    });

    it('success', async () => {
      const response = await getFavourites(client.token);
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

  describe('(POST) Toggle Favourite', () => {
    let product: Schema$Product;

    beforeEach(async () => {
      [product] = await setupProducts([{}]);
    });

    it('success', async () => {
      let response = await toggleFavourite(client.token, product.id);
      const favourite = response.body.data;
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.product).toBeObject();
      expect(response.body.data.product._id).toBeUndefined();

      response = await toggleFavourite(client.token, product.id);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toBeUndefined();

      response = await getFavourites(client.token);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.data).not.toIncludeAnyMembers([favourite]);
    });

    it('cannot controlled by others', async () => {
      let response = await toggleFavourite(client.token, product.id);
      const favourite = response.body.data;
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toBeDefined();

      response = await toggleFavourite(admin.token, product.id);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toBeDefined();

      response = await getFavourites(client.token);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.data).toIncludeAnyMembers([favourite]);
    });
  });

  describe('(DEL) Delete Favourite', () => {
    let favourite: Schema$Favourite;

    beforeEach(async () => {
      const [product] = await setupProducts([{}]);
      const response = await toggleFavourite(client.token, product.id);
      favourite = response.body.data;
    });

    it('success', async () => {
      let response = await deleteFavourite(client.token, favourite.id);

      expect(response.status).toBe(HttpStatus.OK);

      response = await getFavourites(client.token);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.data).not.toIncludeSameMembers([favourite]);
    });

    it('cannot deleted by other clients', async () => {
      const otherClientToken = await getToken(
        createUser(admin.token, { role: UserRole.CLIENT })
      );

      let response = await deleteFavourite(otherClientToken, favourite.id);

      response = await getFavourites(client.token);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.data).toIncludeAnyMembers([favourite]);
    });

    it('can be deleted by admin', async () => {
      let response = await deleteFavourite(admin.token, favourite.id);

      response = await getFavourites(client.token);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.data).not.toIncludeAnyMembers([favourite]);
    });
  });
});

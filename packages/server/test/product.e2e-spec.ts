import { HttpStatus } from '@nestjs/common';
import { Schema$Tags, Schema$Category } from '@fullstack/typings';
import { ProductsService } from '../src/products/products.service';
import { Product } from '../src/products/schemas/products.schema';
import { setupUsers } from './utils/setupUsers';
import { setupProducts } from './utils/setupProducts';
import {
  CreateProductDto,
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProduct,
  getTags,
  getCategories
} from './service/products';
import { cloudinarySign, cloudinaryUpload } from './service/cloudinary';
import { rid } from './utils/rid';
import superagent from 'superagent';
import path from 'path';

describe('ProductsController (e2e)', () => {
  const productsService = app.get<ProductsService>(ProductsService);

  beforeAll(async () => {
    await setupUsers();
  });

  describe('(GET)  Get Products', () => {
    const tags = [rid(), rid()];
    const options: Partial<CreateProductDto | Record<string, any>>[] = [
      {},
      { tags: [tags[0]] },
      { tags: [tags[1]] },
      { hidden: true }
    ];
    beforeAll(async () => {
      await setupProducts(options);
    });

    it('success', async () => {
      const response = await getProducts(adminToken);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.data.length).toBe(products.length);
    });

    it.each([
      [0, [rid()]],
      [1, [tags[0]]],
      [1, [tags[1]]],
      [2, [...tags]],
      [options.length, []]
    ])('query - tags %s', async (expected, query) => {
      const response = await getProducts(adminToken, { tags: query });
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.data.length).toBe(expected);
    });

    it('client should not find freeze/amount/remain of the product', async () => {
      const response = await getProducts(clientToken);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.data).toSatisfyAll(
        product =>
          typeof product.freeze === 'undefined' &&
          typeof product.amount === 'undefined' &&
          typeof product.remain === 'undefined'
      );
    });

    it('client should not find hidden product', async () => {
      const hiddenProducts = products.filter(({ hidden }) => hidden);
      const response = await getProducts(clientToken);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.data).toSatisfyAll(
        product => typeof product.hidden === 'undefined'
      );
      expect(response.body.data.data.length).toBe(
        products.length - hiddenProducts.length
      );
    });
  });

  describe('(GET)  Get Product Tags', () => {
    const tags = ['1', '2', '3'];
    beforeAll(async () => {
      await productsService.clear();
      await Promise.all(
        tags.map(tag => createProduct(adminToken, { tags: [tag] }))
      );
    });

    it('success', async () => {
      const response = await getTags();
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toIncludeSameMembers(
        tags.map<Schema$Tags>(tag => ({ tag, total: 1 }))
      );
    });
  });

  describe('(GET)  Get Product Category', () => {
    const categories = ['1', '2', '3'];
    beforeAll(async () => {
      await productsService.clear();
      await Promise.all(
        categories.map(category => createProduct(adminToken, { category }))
      );
    });

    it('success', async () => {
      const response = await getCategories();
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.length).toBe(categories.length);
      expect(response.body.data).toIncludeSameMembers(
        categories.map<Schema$Category>(category => ({ category, total: 1 }))
      );
    });
  });

  describe('(GET)  Get Product', () => {
    let product: Product;
    beforeAll(async () => {
      const response = await createProduct(adminToken);
      product = response.body.data;
    });

    it('success', async () => {
      const response = await getProduct(adminToken, product.id);
      expect(response.status).toBe(HttpStatus.OK);
    });
  });

  describe('(POST) Create Product', () => {
    it('success', async () => {
      const response = await Promise.all([
        createProduct(adminToken),
        createProduct(managerToken)
      ]);
      expect(response).toSatisfyAll(res => res.status === HttpStatus.CREATED);
    });

    it('tags', async () => {
      const tags = ['1', '2', '3'];
      const response = await createProduct(adminToken, { tags });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.data.tags).toEqual(tags);
    });

    it('forbidden', async () => {
      const response = await Promise.all([createProduct(clientToken)]);
      expect(response).toSatisfyAll(res => res.status === HttpStatus.FORBIDDEN);
    });
  });

  describe('(PTCH)  Update Product', () => {
    let product: Product;
    const newName = 'e2e-name';
    beforeAll(async () => {
      const response = await createProduct(adminToken);
      product = response.body.data;
    });

    it('suceess', async () => {
      const response = await updateProduct(adminToken, product.id, {
        name: newName
      });
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toMatchObject({ name: newName });
    });

    it('forbidden', async () => {
      const response = await updateProduct(clientToken, product.id, {
        name: newName
      });
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });

  describe('(DEL)  Delete Product', () => {
    let product: Product;
    beforeAll(async () => {
      const response = await createProduct(adminToken);
      product = response.body.data;
    });

    it('forbidden', async () => {
      const response = await deleteProduct(clientToken, product.id);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('success', async () => {
      let response = await deleteProduct(adminToken, product.id);
      expect(response.status).toBe(HttpStatus.OK);
      response = await getProduct(adminToken, product.id);
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  test.skip('cloudinary image should be removed', async () => {
    jest.setTimeout(60 * 1000);

    const signPayload = await cloudinarySign(adminToken);

    let response = await createProduct(adminToken);
    let product: Product = response.body.data;

    const update = async () =>
      updateProduct(adminToken, product.id, {
        images: [
          await cloudinaryUpload({
            ...signPayload,
            file: path.resolve(__dirname, './utils/1x1.png')
          }).then(res => res.secure_url)
        ]
      });

    // test case
    const actions = [
      // replace
      () => update(),
      // remove
      () => updateProduct(adminToken, product.id, { images: [] }),
      // delete
      () => deleteProduct(adminToken, product.id)
    ];

    for (const action of actions) {
      response = await update();
      product = response.body.data;

      expect(product.images).toSatisfyAll(url => /cloudinary/.test(url));

      response = await action();
      const responseArr = await Promise.all(
        product.images.map(url =>
          superagent.get(url).catch(response => response)
        )
      );
      expect(responseArr).toSatisfyAll(
        res => res.status === HttpStatus.NOT_FOUND
      );
    }
  });
});

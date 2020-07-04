import { HttpStatus } from '@nestjs/common';
import { Product } from '../src/products/schemas/products.schema.dto';
import { CreateProductDto } from '../src/products/dto/create-product.dto';
import { UpdateProductDto } from '../src/products/dto/update-product.dto';
import { rid, setupUsers } from './utils/setupUsers';
import superagent, { SuperAgentRequest } from 'superagent';
import path from 'path';

describe('ProductsController (e2e)', () => {
  beforeAll(async () => {
    await setupUsers();
  });

  function createProductDto(dto: Partial<CreateProductDto> = {}) {
    return {
      name: `e2e-product-${rid()}`,
      price: 100,
      amount: 100,
      category: rid(8),
      ...dto
    };
  }

  function createProduct(
    token: string,
    dto: Partial<CreateProductDto> = {}
  ): SuperAgentRequest {
    return request
      .post('/api/products')
      .set('Authorization', `bearer ${token}`)
      .set('Content-Type', 'multipart/form-data')
      .field(createProductDto(dto) as any);
  }

  function getProducts(token: string) {
    return request.get(`/api/products`).set('Authorization', `bearer ${token}`);
  }

  function getProduct(token: string, id: string) {
    return request
      .get(`/api/products/${id}`)
      .set('Authorization', `bearer ${token}`);
  }

  function updaeProduct(token: string, id: string, changes: UpdateProductDto) {
    return request
      .patch(`/api/products/${id}`)
      .set('Authorization', `bearer ${token}`)
      .set('Content-Type', 'multipart/form-data')
      .field((changes || {}) as any);
  }

  function deleteProduct(token: string, id: string) {
    return request
      .delete(`/api/products/${id}`)
      .set('Authorization', `bearer ${token}`);
  }

  describe('(GET)  Get Products', () => {
    let products: Product[] = [];
    beforeAll(async () => {
      const options: Partial<CreateProductDto>[] = [{}];
      products = await Promise.all(
        options.map(dto =>
          createProduct(adminToken, dto).then(res => res.body.data)
        )
      );
    });

    it('success', async () => {
      const response = await getProducts(adminToken);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.data.length).toBe(products.length);
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

    it('forbidden', async () => {
      const response = await Promise.all([createProduct(clientToken)]);
      expect(response).toSatisfyAll(res => res.status === HttpStatus.FORBIDDEN);
    });
  });

  describe('(PTCH)  Update User', () => {
    let product: Product;
    const newName = 'e2e-name';
    beforeAll(async () => {
      const response = await createProduct(adminToken);
      product = response.body.data;
    });

    it('suceess', async () => {
      const response = await updaeProduct(adminToken, product.id, {
        name: newName
      });
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toMatchObject({ name: newName });
    });

    it('forbidden', async () => {
      const response = await updaeProduct(clientToken, product.id, {
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

    const key: keyof Product = 'images';
    const attach = (req: SuperAgentRequest) =>
      req.attach(`${key}[]`, path.resolve(__dirname, './utils/1x1.png'));

    let response = await attach(createProduct(adminToken));
    const product: Product = response.body.data;

    expect(product.images[0]).toContain('cloudinary');

    // test case
    const actions = [
      //
      () => deleteProduct(adminToken, product.id)
    ];

    for (const action of actions) {
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

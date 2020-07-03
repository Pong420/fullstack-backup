import { HttpStatus } from '@nestjs/common';
import { CreateProductDto } from '../src/products/dto/create-product.dto';
import { rid, setupUsers } from './utils/setupUsers';

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

  function createProduct(token: string, dto: Partial<CreateProductDto> = {}) {
    const params = createProductDto(dto);
    return request
      .post('/api/products')
      .set('Authorization', `bearer ${token}`)
      .set('Content-Type', 'multipart/form-data')
      .field(params as any);
  }

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
});

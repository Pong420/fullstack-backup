import { HttpStatus } from '@nestjs/common';
import { CreateOrderDto } from '../src/orders/dto/create-order.dto';
import { rid } from './utils/rid';
import { setupUsers } from './utils/setupUsers';
import { setupProducts } from './utils/setupProducts';
import { SuperAgentRequest } from 'superagent';

describe('OrdersController (e2e)', () => {
  beforeAll(async () => {
    await setupUsers();
    await setupProducts([{}, {}, {}]);
  });

  function createOrder(token: string, dto: CreateOrderDto): SuperAgentRequest {
    return request
      .post('/api/orders')
      .set('Authorization', `bearer ${token}`)
      .send(dto);
  }

  describe('(POST) Create Order', () => {
    it('success', async () => {
      const response = await createOrder(adminToken, {
        products: products.map(({ id }) => ({ id, amount: 1 }))
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });

    it('bad request', async () => {
      const response = await Promise.all([
        createOrder(adminToken, {
          products: products.map(({ id, amount }) => ({
            id,
            amount: amount + 1
          }))
        }),
        createOrder(adminToken, {
          products: products.map(({ id }) => ({ id, amount: undefined }))
        }),
        createOrder(adminToken, {
          products: [{ id: rid(), amount: 1 }]
        })
      ]);
      expect(response).toSatisfyAll(
        res => res.status === HttpStatus.BAD_REQUEST
      );
    });
  });

  // TODO: client create / get / update should not contain user
});

import { HttpStatus } from '@nestjs/common';
import { CreateOrderDto } from '../src/orders/dto/create-order.dto';
import { setupUsers } from './utils/setupUsers';
import { setupProducts } from './utils/setupProducts';
import { SuperAgentRequest } from 'superagent';

describe('OrdersController (e2e)', () => {
  beforeAll(async () => {
    await setupUsers();
    await setupProducts([{}]);
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
  });

  // TODO: client create / get / update should not contain user
});

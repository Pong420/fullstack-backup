import { HttpStatus } from '@nestjs/common';
import { Schema$Order, OrderStatus, Schema$Product } from '@fullstack/typings';
import { rid } from './utils/rid';
import { setupUsers } from './utils/setupUsers';
import { setupProducts } from './utils/setupProducts';
import { createProduct, getProducts, getProduct } from './service/products';
import { createOrder, updateOrder } from './service/orders';

const address = 'address';

const delay = (ms: number) => new Promise(_ => setTimeout(_, ms));

describe('OrdersController (e2e)', () => {
  beforeAll(async () => {
    await setupUsers();
  });

  describe('(POST) Create Order', () => {
    beforeAll(async () => {
      await setupProducts([{}, {}, {}]);
    });
    it('success', async () => {
      const amount = 1;
      let response = await createOrder(client.token, {
        address,
        products: products.map(({ id }) => ({ id, amount }))
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.data.user).toBeUndefined();

      response = await getProducts(admin.token);
      expect(response.body.data.data).toSatisfyAll(
        ({ freeze }) => freeze === amount
      );
    });

    it('bad request', async () => {
      const response = await Promise.all([
        createOrder(admin.token, {
          address,
          products: products.map(({ id, amount }) => ({
            id,
            amount: amount + 1
          }))
        }),
        createOrder(admin.token, {
          address,
          products: products.map(({ id }) => ({ id, amount: undefined }))
        }),
        createOrder(admin.token, {
          address,
          products: [{ id: rid(), amount: 1 }]
        })
      ]);
      expect(response).toSatisfyAll(
        res => res.status === HttpStatus.BAD_REQUEST
      );
    });
  });

  describe('(PTCH) Update Order', () => {
    let order: Schema$Order;
    let product: Schema$Product;
    const totalAmount = 100;
    const amount = 1;

    beforeEach(async () => {
      product = null;
      product = await createProduct(admin.token, { amount: totalAmount }).then(
        res => res.body.data
      );
      await delay(100);
      order = null;
      order = await createOrder(client.token, {
        address,
        products: [product].map(({ id }) => ({ id, amount }))
      }).then(res => res.body.data);
      await delay(100);
    });

    it('bad request', async () => {
      const response = await Promise.all([
        updateOrder(client.token, order.id, { status: OrderStatus.PENDING }),
        updateOrder(client.token, order.id, { status: OrderStatus.SHIPPING }),
        updateOrder(client.token, order.id, { status: OrderStatus.DONE }),
        updateOrder(admin.token, order.id, {
          status: OrderStatus.SHIPPING
        }).then(() => updateOrder(client.token, order.id, { address: rid() }))
      ]);
      expect(response).toSatisfyAll(
        res => res.status === HttpStatus.BAD_REQUEST
      );
    });

    it('shipping', async () => {
      const response = await updateOrder(admin.token, order.id, {
        status: OrderStatus.SHIPPING
      });
      expect(response.status).toBe(HttpStatus.OK);
      expect(
        getProduct(admin.token, product.id).then(res => res.body.data)
      ).resolves.toMatchObject({
        amount: totalAmount - amount,
        remain: totalAmount - amount,
        freeze: 0
      });
    });

    it('client update', async () => {
      const response = await updateOrder(client.token, order.id, {
        address: rid()
      });
      expect(response.status).toBe(HttpStatus.OK);
    });

    it('cancel order', async () => {
      let response = await updateOrder(client.token, order.id, {
        status: OrderStatus.CACNELED
      });
      expect(response.status).toBe(HttpStatus.OK);

      response = await getProduct(admin.token, product.id);
      expect(response.body.data.freeze).toBe(0);
    });
  });
});

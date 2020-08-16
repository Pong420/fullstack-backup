import { HttpStatus } from '@nestjs/common';
import { Schema$Address, UserRole } from '@fullstack/typings';
import { setupUsers } from './utils/setupUsers';
import { getAddresses, createAddress, updateAddress } from './service/address';
import { createUser } from './service/users';
import { getToken } from './service/auth';

describe('AddresssController (e2e)', () => {
  beforeAll(async () => {
    await setupUsers();
  });

  describe('(Get) Get Addresses', () => {
    let addresses: Schema$Address[] = [];

    beforeAll(async () => {
      addresses = await Promise.all(
        [
          ...Array.from({ length: 3 }, () =>
            createAddress(clientToken, { address: [''] })
          ),
          createAddress(adminToken, { address: [''] })
        ].map(req => req.then(res => res.body.data))
      );
    });

    it('success', async () => {
      const response = await getAddresses(clientToken);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.length).toBe(addresses.length - 1);
    });
  });

  describe('(POST) Create Address', () => {
    it('success', async () => {
      const response = await createAddress(clientToken, {
        address: ['1', '2', '3']
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.data.user).toBeUndefined();
    });
  });

  describe('(PTCH) Update Address', () => {
    let address: Schema$Address;
    const address_1 = ['3', '2', '1'];
    const address_2 = ['4', '5', '6'];

    beforeAll(async () => {
      const response = await createAddress(clientToken, {
        address: ['1', '2', '3']
      });
      address = response.body.data;
    });

    it('success', async () => {
      let response = await updateAddress(clientToken, address.id, {
        address: address_1
      });
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.address).toEqual(address_1);

      response = await updateAddress(adminToken, address.id, {
        address: address_2
      });
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.address).toEqual(address_2);
    });

    it('unauthorized', async () => {
      const otherClientToken = await getToken(
        createUser(adminToken, { role: UserRole.CLIENT })
      );
      const response = await updateAddress(otherClientToken, address.id, {
        address: address_1
      });
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    });
  });
});

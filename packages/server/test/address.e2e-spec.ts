import { HttpStatus } from '@nestjs/common';
import { Schema$Address, UserRole } from '@fullstack/typings';
import { setupUsers } from './utils/setupUsers';
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress
} from './service/address';
import { getToken, createAndLogin } from './service/auth';

describe('AddresssController (e2e)', () => {
  beforeAll(async () => {
    await setupUsers();
  });

  describe('(Get) Get Addresses', () => {
    let addresses: Schema$Address[] = [];

    beforeAll(async () => {
      addresses = await Promise.all(
        [
          createAddress(client.token, { address: [''] }),
          createAddress(client.token, { address: [''] }),
          createAddress(client.token, { address: [''] }),
          createAddress(admin.token, { address: [''] })
        ].map(req => req.then(res => res.body.data))
      );
    });

    it('success', async () => {
      let response = await getAddresses(client.token);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toIncludeAllMembers(addresses.slice(0, 3));

      response = await getAddresses(admin.token);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toIncludeAllMembers(addresses.slice(3, 4));
    });
  });

  describe('(POST) Create Address', () => {
    it('success', async () => {
      const response = await createAddress(client.token, {
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

    beforeEach(async () => {
      const response = await createAddress(client.token, {
        address: ['1', '2', '3']
      });
      address = response.body.data;
    });

    it('can be updated by self or admin', async () => {
      let response = await updateAddress(client.token, address.id, {
        address: address_1
      });
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.address).toEqual(address_1);

      response = await updateAddress(admin.token, address.id, {
        address: address_2
      });
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.address).toEqual(address_2);
    });

    it("cannot update other client's address", async () => {
      const otherClientToken = await getToken(
        createAndLogin(admin.token, { role: UserRole.CLIENT })
      );
      const response = await updateAddress(otherClientToken, address.id, {
        address: address_1
      });
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('(Del) Del Address', () => {
    let address: Schema$Address;

    beforeEach(async () => {
      const response = await createAddress(client.token, {
        address: ['1', '2', '3']
      });
      address = response.body.data;
    });

    it('can be deleted by self', async () => {
      let response = await deleteAddress(client.token, address.id);
      expect(response.status).toBe(HttpStatus.OK);

      response = await getAddresses(client.token);
      expect(response.body.data).not.toIncludeAllMembers([address]);
    });

    it('can be deleted by admin', async () => {
      let response = await deleteAddress(admin.token, address.id);
      expect(response.status).toBe(HttpStatus.OK);

      response = await getAddresses(client.token);
      expect(response.body.data).not.toIncludeAllMembers([address]);
    });

    it('cannot deleted by other clients', async () => {
      const otherClientToken = await getToken(
        createAndLogin(admin.token, { role: UserRole.CLIENT })
      );
      let response = await deleteAddress(otherClientToken, address.id);
      expect(response.status).toBe(HttpStatus.OK);

      response = await getAddresses(client.token);
      expect(response.body.data).toIncludeAllMembers([address]);
    });
  });
});

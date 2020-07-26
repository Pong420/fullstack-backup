import { api } from './api';
import {
  Area,
  Param$CreateAddress,
  Param$UpdateAddress,
  Response$Address,
  Response$GetAddresses,
  Address$HongKong
} from '@fullstack/typings';
import { paths } from '../constants';

export function getAddresses() {
  return api.get<Response$GetAddresses>(paths.get_addresses);
}

export function createAddress(params: Param$CreateAddress) {
  return api.post<Response$Address>(paths.create_address, params);
}

export function updateAddress(params: Param$UpdateAddress) {
  return api.patch<Response$Address>(paths.update_address, params);
}

export function parseAddress(area: string, address: string[]) {
  switch (area) {
    case Area.HongKong:
      return (() => {
        const [district, street, buildingOrBlock, floor, flatOrRoom] = address;
        return {
          district,
          street,
          buildingOrBlock,
          floor,
          flatOrRoom
        } as Address$HongKong;
      })();

    default:
      throw new Error('unknown area');
  }
}

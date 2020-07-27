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

export function addressParser<T>(area: string) {
  return {
    parse: (address: string[]) => parseAddress<T>(area, address),
    toArray: (address: T) => formAddressArray(area, address)
  };
}

export function parseAddress<T>(area: string, address: string[]): T {
  switch (area) {
    case Area.HongKong:
      return (() => {
        const [district, street, buildingOrBlock, floor, flatOrRoom] = address;
        const result: unknown = {
          district,
          street,
          buildingOrBlock,
          floor,
          flatOrRoom
        };
        return result as T;
      })();

    default:
      throw new Error('unknown area');
  }
}

export function formAddressArray(area: string, address: unknown): string[] {
  switch (area) {
    case Area.HongKong:
      return (() => {
        const {
          district,
          street,
          buildingOrBlock,
          floor,
          flatOrRoom
        } = address as Address$HongKong;
        return [district, street, buildingOrBlock, floor, flatOrRoom];
      })();

    default:
      throw new Error('unknown area');
  }
}

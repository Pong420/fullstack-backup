import { Timestamp, ApiResponse } from './index';

export enum Area {
  HongKong = 'Hong Kong'
}

export interface Param$Address {
  id: string;
}

export interface Param$CreateAddress {
  user?: string;
  area?: Area;
  address: string[];
}

export interface Param$UpdateAddress {
  id: string;
  address: string[];
}

export interface Schema$Address
  extends Timestamp,
    Param$Address,
    Param$CreateAddress {
  user: string;
}

export type Response$GetAddresses = ApiResponse<Schema$Address[]>;
export type Response$Address = ApiResponse<Schema$Address>;

export interface Address$HongKong {
  district: string;
  street: string;
  buildingOrBlock: string;
  floor: string;
  flatOrRoom: string;
}

import { Timestamp } from './index';

export interface Param$Address {
  id: string;
}

export interface Param$CreateAddress {
  user?: string;
  area: string;
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

import { StackScreenProps } from '@react-navigation/stack';
import { Schema$Address, Area } from '@fullstack/typings';
import { CRUDActions } from '@fullstack/common/hooks/crud';

type Actions = CRUDActions<Schema$Address, 'id'>;

export type DeliveryAddressParamList = {
  Main: { address?: Schema$Address; action?: Actions };
  Create: { area: Area };
  Update: Schema$Address;
};

export type DeliveryAddressScreenProps<
  T extends keyof DeliveryAddressParamList
> = StackScreenProps<DeliveryAddressParamList, T>;

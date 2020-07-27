import { Schema$Address, Area } from '@fullstack/typings';
import { CRUDActions } from '../../../hooks/crud';

type Actions = CRUDActions<Schema$Address, 'id'>;

export type RootStackParamList = {
  Main: { address?: Schema$Address; action?: Actions };
  Create: { area: Area };
  Update: Schema$Address;
};

import { Schema$Address, Area } from '@fullstack/typings';

export type RootStackParamList = {
  Main: { address?: Schema$Address };
  Create: { area: Area };
};

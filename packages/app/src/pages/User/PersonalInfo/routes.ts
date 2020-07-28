import { Schema$User } from '@fullstack/typings';
import { StackScreenProps } from '@react-navigation/stack';

export type PersonalInfoParamList = {
  ValidatePassword: undefined;
  Main: { user: Schema$User };
  NewNickName: undefined;
  NewEmail: undefined;
};

export type PersonalInfoScreenProps<
  T extends keyof PersonalInfoParamList
> = StackScreenProps<PersonalInfoParamList, T>;

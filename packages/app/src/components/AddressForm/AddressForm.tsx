import React from 'react';
import { Area, Address$HongKong } from '@fullstack/typings';
import { HongKonAddressForm } from './HongKonAddressForm';
import { createForm, FormProps } from '../../utils/form';

interface Props extends FormProps<Record<string, string>, string[]> {
  editable?: boolean;
  area: string;
}

export const { useForm } = createForm<Record<string, string>, string[]>();

export function AddressForm({ area, ...props }: Props) {
  switch (area) {
    case Area.HongKong:
      return (
        <HongKonAddressForm
          {...(props as FormProps<Address$HongKong, string[]>)}
        />
      );
    default:
      return null;
  }
}

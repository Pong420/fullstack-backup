import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Area } from '@fullstack/typings';
import { parseAddress, formAddressArray } from '@fullstack/common/service';
import { HongKonAddressForm } from './HongKonAddressForm';
import { createForm, FormProps } from '../../utils/form';

interface ContentProps {
  area: string;
  editable?: boolean;
  contentContainerStyle?: ViewStyle;
}

interface Props
  extends ContentProps,
    FormProps<Record<string, string>, string[]> {}

export const { Form, useForm } = createForm<Record<string, string>, string[]>();

function AddressFormContent({ area, ...props }: ContentProps) {
  switch (area) {
    case Area.HongKong:
      return <HongKonAddressForm {...props} />;
    default:
      return null;
  }
}

export function AddressForm({
  area,
  editable,
  contentContainerStyle,
  children,
  ...props
}: Props) {
  return (
    <Form
      {...props}
      style={styles.form}
      beforeSubmit={store => formAddressArray(area, store)}
      transoformInitialValues={values => parseAddress(area, values)}
    >
      <View style={contentContainerStyle}>
        <AddressFormContent area={area} editable={editable} />
      </View>
      {children}
    </Form>
  );
}

const styles = StyleSheet.create({
  form: {
    flex: 1
  }
});

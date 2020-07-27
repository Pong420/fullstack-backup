import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Address$HongKong } from '@fullstack/typings';
import { district } from '@fullstack/common/constants/area/hongkong';
import { createTextInput } from '../TextInput';
import { Select, SelectValue } from '../Select';
import { createForm, FormProps } from '../../utils/form';

interface Props extends FormProps<Address$HongKong, string[]> {
  editable?: boolean;
}

const { FormItem } = createForm<Address$HongKong, string[]>({
  style: { marginBottom: 0 },
  itemStyles: { label: { fontSize: 14, color: '#8a9ba8', marginBottom: 0 } }
});

export const TextInput = createTextInput({ border: 'bottom' });

const options: SelectValue[] = district.map(district => ({
  label: district,
  value: district
}));

export function HongKonAddressForm({ editable, ...props }: Props) {
  return (
    <>
      <FormItem label="District" name="district">
        <Select title="District" options={options} editable={editable} />
      </FormItem>

      <FormItem label="Street" name="street">
        <TextInput
          editable={editable}
          textContentType="fullStreetAddress"
          autoCompleteType="street-address"
        />
      </FormItem>

      <FormItem label="Building name / block" name="buildingOrBlock">
        <TextInput editable={editable} />
      </FormItem>

      <View style={styles.row}>
        <FormItem label="Floor" name="floor" style={styles.half}>
          <TextInput editable={editable} />
        </FormItem>

        <View style={styles.spacer} />

        <FormItem label="Flat / room" name="flatOrRoom" style={styles.half}>
          <TextInput editable={editable} />
        </FormItem>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  half: {
    flex: 1
  },
  spacer: { width: 20 }
});

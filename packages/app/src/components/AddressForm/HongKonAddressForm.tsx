import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Address$HongKong } from '@fullstack/typings';
import { district } from '@fullstack/common/constants/area/hongkong';
import { createTextInput, useFocusNextHandler } from '../TextInput';
import { Select, SelectValue } from '../Select';
import { createForm, validators } from '../../utils/form';

interface Props {
  editable?: boolean;
  onSubmit?: () => void;
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

export function HongKonAddressForm({ editable, onSubmit }: Props) {
  const { focusNextProps, refProps } = useFocusNextHandler<Address$HongKong>();

  return (
    <>
      <FormItem
        label="District"
        name="district"
        validators={[validators.required('District cannot be empty')]}
      >
        <Select title="District" options={options} editable={editable} />
      </FormItem>

      <FormItem
        label="Street"
        name="street"
        validators={[validators.required('Street cannot be empty')]}
      >
        <TextInput
          editable={editable}
          textContentType="fullStreetAddress"
          autoCompleteType="street-address"
          ref={refProps('street')}
          {...focusNextProps('buildingOrBlock')}
        />
      </FormItem>

      <FormItem
        label="Building name / block"
        name="buildingOrBlock"
        validators={[
          validators.required('Building name / block cannot be empty')
        ]}
      >
        <TextInput
          editable={editable}
          ref={refProps('buildingOrBlock')}
          {...focusNextProps('floor')}
        />
      </FormItem>

      <View style={styles.row}>
        <FormItem
          label="Floor"
          name="floor"
          style={styles.half}
          validators={[validators.required('Floor cannot be empty')]}
        >
          <TextInput
            editable={editable}
            ref={refProps('floor')}
            {...focusNextProps('flatOrRoom')}
          />
        </FormItem>

        <View style={styles.spacer} />

        <FormItem
          label="Flat / room"
          name="flatOrRoom"
          style={styles.half}
          validators={[validators.required('Flat / form cannot be empty')]}
        >
          <TextInput
            editable={editable}
            ref={refProps('flatOrRoom')}
            onSubmitEditing={onSubmit}
            returnKeyType={onSubmit ? 'send' : undefined}
          />
        </FormItem>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },
  half: {
    flex: 1
  },
  spacer: { width: 20 }
});

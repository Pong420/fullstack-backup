import React, { useRef, useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useRxAsync } from 'use-rx-hooks';
import { Schema$Address } from '@fullstack/typings';
import { updateAddress } from '@fullstack/common/service';
import { StackScreenProps } from '@react-navigation/stack';
import { Button } from '../../../components/Button';
import { PageModal } from '../../../components/PageModal';
import { toaster } from '../../../components/Toast';
import { AddressForm, useForm } from '../../../components/AddressForm';
import { RootStackParamList } from './route';
import { KeyboardAvoidingViewFooter } from '../../../components/KeyboardAvoidingViewFooter';

const request = (...args: Parameters<typeof updateAddress>) =>
  updateAddress(...args).then(res => res.data.data);

const onFailure = toaster.apiError.bind(
  toaster,
  'Update delivery address failure'
);

export function UpdateAddressScreen({
  navigation,
  route
}: StackScreenProps<RootStackParamList, 'Update'>) {
  const { id, area, address } = route.params;
  const { current: onSuccess } = useRef((payload: Schema$Address) => {
    navigation.navigate('Main', {
      address: payload,
      action: { type: 'UPDATE', payload }
    });
    toaster.success({ message: 'Update delivery address success' });
  });
  const { run, loading } = useRxAsync(request, {
    defer: true,
    onSuccess,
    onFailure,
    effect: useLayoutEffect
  });
  const [form] = useForm();

  return (
    <PageModal title="Update Delivery Address" onClose={navigation.goBack}>
      <AddressForm
        area={area}
        form={form}
        initialValues={address}
        contentContainerStyle={styles.content}
        onFinish={address => run({ id, address })}
      >
        <KeyboardAvoidingViewFooter style={styles.button}>
          <Button
            intent="DARK"
            title="Confirm"
            loading={loading}
            onPress={form.submit}
          />
        </KeyboardAvoidingViewFooter>
      </AddressForm>
    </PageModal>
  );
}

const containerPadding = 24;
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    padding: containerPadding
  },
  button: {
    padding: containerPadding
  }
});

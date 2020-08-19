import React, { useRef, useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useRxAsync } from 'use-rx-hooks';
import { Schema$Address } from '@fullstack/typings';
import { Button } from '@/components/Button';
import { PageModal } from '@/components/PageModal';
import { toaster } from '@/components/Toast';
import { AddressForm, useForm } from '@/components/AddressForm';
import { KeyboardAvoidingViewFooter } from '@/components/KeyboardAvoidingViewFooter';
import { createAddress } from '@/service';
import { containerPadding } from '@/styles';
import { DeliveryAddressScreenProps } from './routes';

const request = (...args: Parameters<typeof createAddress>) =>
  createAddress(...args).then(res => res.data.data);

const onFailure = toaster.apiError.bind(
  toaster,
  'New delivery address failure'
);

export function CreateAddressScreen({
  navigation,
  route
}: DeliveryAddressScreenProps<'Create'>) {
  const { area } = route.params;
  const { current: onSuccess } = useRef((payload: Schema$Address) => {
    navigation.navigate('Main', {
      address: payload,
      action: { type: 'CREATE', payload }
    });
    toaster.success({ message: 'New delivery address success' });
  });
  const { run, loading } = useRxAsync(request, {
    defer: true,
    onSuccess,
    onFailure,
    effect: useLayoutEffect
  });
  const [form] = useForm();

  return (
    <PageModal title="New Delivery Address" onClose={navigation.goBack}>
      <AddressForm
        area={area}
        form={form}
        contentContainerStyle={styles.content}
        onFinish={address => run({ area, address })}
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

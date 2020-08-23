import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useRxAsync } from 'use-rx-hooks';
import { Schema$Address } from '@fullstack/typings';
import { Button } from '@/components/Button';
import { PageModal } from '@/components/PageModal';
import { toaster } from '@/components/Toast';
import { AddressForm, useForm } from '@/components/AddressForm';
import { KeyboardAvoidingViewFooter } from '@/components/KeyboardAvoidingViewFooter';
import { containerPadding } from '@/styles';
import { updateAddress } from '@/service';
import { DeliveryAddressScreenProps } from './routes';

const request = (...args: Parameters<typeof updateAddress>) =>
  updateAddress(...args).then(res => res.data.data);

const onFailure = toaster.apiError.bind(
  toaster,
  'Update delivery address failure'
);

export function UpdateAddressScreen({
  navigation,
  route
}: DeliveryAddressScreenProps<'Update'>) {
  const { id, area, address } = route.params;
  const { current: onSuccess } = useRef((payload: Schema$Address) => {
    navigation.navigate('Main', {
      address: payload,
      action: { type: 'UPDATE', payload }
    });
    toaster.success({ message: 'Update delivery address success' });
  });
  const [{ loading }, { fetch }] = useRxAsync(request, {
    defer: true,
    onSuccess,
    onFailure
    // effect: useLayoutEffect // TODO:
  });
  const [form] = useForm();

  return (
    <PageModal title="Update Delivery Address" onClose={navigation.goBack}>
      <AddressForm
        area={area}
        form={form}
        initialValues={address}
        contentContainerStyle={styles.content}
        onFinish={address => fetch({ id, address })}
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

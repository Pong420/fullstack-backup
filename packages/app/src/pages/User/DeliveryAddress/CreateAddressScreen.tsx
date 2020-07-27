import React, { useRef, useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useRxAsync } from 'use-rx-hooks';
import { Schema$Address } from '@fullstack/typings';
import { createAddress } from '@fullstack/common/service';
import { StackScreenProps } from '@react-navigation/stack';
import { Button } from '../../../components/Button';
import { PageModal } from '../../../components/PageModal';
import { toaster } from '../../../components/Toast';
import { AddressForm, useForm } from '../../../components/AddressForm';
import { RootStackParamList } from './route';
import { KeyboardAvoidingViewFooter } from '../../../components/KeyboardAvoidingViewFooter';

const request = (...args: Parameters<typeof createAddress>) =>
  createAddress(...args).then(res => res.data.data);

const onFailure = toaster.apiError.bind(toaster, 'New deliver address failure');

export function CreateAddressScreen({
  navigation,
  route
}: StackScreenProps<RootStackParamList, 'Create'>) {
  const { area } = route.params;
  const { current: onSuccess } = useRef((payload: Schema$Address) => {
    navigation.navigate('Main', {
      address: payload,
      action: { type: 'CREATE', payload }
    });
    toaster.success({ message: 'New deliver address success' });
  });
  const { run, loading } = useRxAsync(request, {
    defer: true,
    onSuccess,
    onFailure,
    effect: useLayoutEffect
  });
  const [form] = useForm();

  return (
    <PageModal title="New Deliver Address" onClose={navigation.goBack}>
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

import React, { useRef } from 'react';
import {
  StyleSheet,
  Modal,
  ModalProps,
  View,
  SafeAreaView
} from 'react-native';
import { useRxAsync } from 'use-rx-hooks';
import { Schema$Address, Area } from '@fullstack/typings';
import { createAddress } from '@fullstack/common/service';
import { Button } from '../../../components/Button';
import { ModalHeader } from '../../../components/Modal';
import { toaster } from '../../../components/Toast';
import { AddressForm, useForm } from '../../../components/AddressForm';

interface Props extends ModalProps {
  area: Area;
  onClose: () => void;
  onCreated: (address: Schema$Address) => void;
}

const request = (...args: Parameters<typeof createAddress>) =>
  createAddress(...args).then(res => res.data.data);

const onFailure = toaster.apiError.bind(toaster, 'New deliver address failure');

export function CreateAddressModal({
  area,
  onClose,
  onCreated,
  ...props
}: Props) {
  const { current: onSuccess } = useRef<Props['onCreated']>(payload => {
    onClose();
    onCreated(payload);
    toaster.success({ message: 'New deliver address success' });
  });
  const { run, loading } = useRxAsync(request, {
    defer: true,
    onSuccess,
    onFailure
  });
  const [form] = useForm();

  return (
    <Modal {...props} animationType="slide">
      <SafeAreaView style={styles.container}>
        <ModalHeader title="New Deliver Address" onClose={onClose} />
        <View style={styles.content}>
          <AddressForm
            area={area}
            form={form}
            onFinish={address => run({ area, address })}
          />
          <Button
            intent="DARK"
            title="Confirm"
            loading={loading}
            onPress={form.submit}
          />
        </View>
      </SafeAreaView>
    </Modal>
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
  }
});

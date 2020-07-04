import React from 'react';
import { Schema$Product } from '@fullstack/typings';
import { openConfirmDialog } from '../../components/ConfirmDialog';
import { ButtonPopover, IconName } from '../../components/ButtonPopover';
import { Toaster } from '../../utils/toaster';
import { createProduct } from '../../service';
import { ProductForm, useForm } from './ProductForm';

export interface OnCreate {
  onCreate: (payload: Schema$Product) => void;
}

interface NewProductProps extends OnCreate {}

const icon: IconName = 'insert';
const title = 'New Product';
export function NewProduct({ onCreate }: NewProductProps) {
  const [form] = useForm();

  async function onConfirm() {
    const payload = await form.validateFields();
    try {
      const response = await createProduct(payload);
      onCreate(response.data.data);
      Toaster.success({ message: 'Create user success' });
    } catch (error) {
      Toaster.apiError('Create user failure', error);
    }
  }

  const children = <ProductForm form={form} />;

  return (
    <ButtonPopover
      minimal
      icon={icon}
      content={title}
      onClick={() =>
        openConfirmDialog({
          icon,
          title,
          children,
          onConfirm,
          onClosed: () => form.resetFields()
        })
      }
    />
  );
}

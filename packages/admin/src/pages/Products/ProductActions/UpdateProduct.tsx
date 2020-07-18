import React, { useRef, useEffect } from 'react';
import { Schema$Product, Param$Product } from '@fullstack/typings';
import { updateProduct } from '@fullstack/common/service';
import { openConfirmDialog } from '../../../components/ConfirmDialog';
import { ButtonPopover, IconName } from '../../../components/ButtonPopover';
import { Toaster } from '../../../utils/toaster';
import { ProductForm, ProductFormInstance, useForm } from '../ProductForm';

export interface OnUpdate {
  onUpdate: (payload: Param$Product & Partial<Schema$Product>) => void;
}

interface NewProductProps extends OnUpdate, Partial<Schema$Product> {}

function ProductFormContainer({
  form,
  ...user
}: { form: ProductFormInstance } & Partial<Schema$Product>) {
  const { setFieldsValue } = form;
  const persists = useRef(user);

  useEffect(() => {
    setFieldsValue(persists.current);
  }, [setFieldsValue]);

  return <ProductForm form={form} />;
}

const icon: IconName = 'edit';
const title = 'Update Product';
export function UpdateProduct({ id, onUpdate, ...products }: NewProductProps) {
  const [form] = useForm();
  const children = <ProductFormContainer form={form} {...products} />;

  async function onConfirm() {
    if (id) {
      const payload = await form.validateFields();
      try {
        const response = await updateProduct({ id, ...payload });
        onUpdate(response.data.data);
        Toaster.success({ message: 'Update product success' });
      } catch (error) {
        Toaster.apiError('Update product failure', error);
        throw error;
      }
    }
  }

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

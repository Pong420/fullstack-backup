import React from 'react';
import { Intent } from '@blueprintjs/core';
import { AsyncFnDialog, AsyncFnDialogProps } from '../../components/Dialog';
import { ProductForm, ProductFormProps, useProductForm } from './ProductForm';

export interface ProductDialogProps
  extends Omit<AsyncFnDialogProps, 'onConfirm'>,
    ProductFormProps {
  id?: string;
}

export const ProductDialog = React.memo(
  ({ id, initialValues, onSubmit, ...props }: ProductDialogProps) => {
    const [form] = useProductForm();

    return (
      <AsyncFnDialog {...props} intent={Intent.PRIMARY} onConfirm={form.submit}>
        <ProductForm
          form={form}
          onSubmit={onSubmit}
          initialValues={initialValues}
        />
      </AsyncFnDialog>
    );
  }
);

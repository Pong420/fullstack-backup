import React, { useCallback } from 'react';
import { useRxAsync } from 'use-rx-async';
import { ButtonPopover } from '../../components/ButtonPopover';
import { ProductDialog } from './ProductDialog';
import { Schema$Product, Param$UpdateProduct } from '../../typings';
import { useProductActions } from '../../store';
import { updateProduct as updateProductAPI } from '../../services';
import { useBoolean } from '../../hooks/useBoolean';

export function EditProduct({ id, ...product }: Partial<Schema$Product>) {
  const [isOpen, { on, off }] = useBoolean();
  const { updateProduct } = useProductActions();
  const request = useCallback(
    async (param: Omit<Param$UpdateProduct, 'id'>) => {
      if (id) {
        const res = await updateProductAPI({ id, ...param });
        updateProduct(res.data.data);
        off();
      }
    },
    [id, updateProduct, off]
  );
  const { run, loading } = useRxAsync(request, { defer: true });

  return (
    <>
      <ButtonPopover minimal icon="edit" content="Edit Product" onClick={on} />
      <ProductDialog
        isOpen={isOpen}
        onClose={off}
        onSubmit={run}
        loading={loading}
        initialValues={product}
      />
    </>
  );
}

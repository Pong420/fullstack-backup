import React, { useCallback } from 'react';
import { useRxAsync } from 'use-rx-async';
import { ButtonPopover } from '../../components/ButtonPopover';
import { ProductDialog } from './ProductDialog';
import { Schema$Product, Param$UpdateProduct } from '../../typings';
import { useProductActions } from '../../store';
import { updateProduct as updateProductAPI } from '../../services';
import { useBoolean } from '../../hooks/useBoolean';

const title = 'Edit Product';
const icon = 'edit';

export function EditProduct({ id = '', ...product }: Partial<Schema$Product>) {
  const [isOpen, { on, off }] = useBoolean();
  const { updateProduct } = useProductActions();

  const request = useCallback(
    (params: Omit<Param$UpdateProduct, 'id'>) =>
      updateProductAPI({ id, ...params }),
    [id]
  );

  const onSuccess = useCallback(() => {
    updateProduct({ id });
    off();
  }, [id, updateProduct, off]);

  const { run, loading } = useRxAsync(request, { defer: true, onSuccess });

  return (
    <>
      <ButtonPopover minimal icon={icon} content={title} onClick={on} />
      <ProductDialog
        icon={icon}
        title={title}
        isOpen={isOpen}
        onClose={off}
        onSubmit={run}
        loading={loading}
        initialValues={product}
      />
    </>
  );
}

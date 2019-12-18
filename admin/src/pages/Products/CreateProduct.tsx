import React, { useCallback } from 'react';
import { useRxAsync } from 'use-rx-async';
import { Classes } from '@blueprintjs/core';
import { ButtonPopover } from '../../components/ButtonPopover';
import { ProductDialog } from './ProductDialog';
import { createProduct as createProductAPI } from '../../services';
import { useProductActions } from '../../store';
import { Schema$Product } from '../../typings';
import { useBoolean } from '../../hooks/useBoolean';

const title = 'Create Product';

const request = (...args: Parameters<typeof createProductAPI>) =>
  createProductAPI(...args).then(res => res.data.data);

export const CreateProduct = React.memo(() => {
  const [isOpen, { on, off }] = useBoolean();

  const { createProduct } = useProductActions();

  const onSuccess = useCallback(
    (product: Schema$Product) => {
      off();
      createProduct(product);
    },
    [off, createProduct]
  );

  const { run, loading } = useRxAsync(request, {
    defer: true,
    onSuccess
  });

  return (
    <>
      <ButtonPopover minimal icon="add" content={title} onClick={on} />
      <ProductDialog
        icon="box"
        className={Classes.OVERLAY_SCROLL_CONTAINER}
        title={title}
        isOpen={isOpen}
        loading={loading}
        onClose={off}
        onSubmit={run}
      />
    </>
  );
});

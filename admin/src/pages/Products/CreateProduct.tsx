import React, { useCallback } from 'react';
import { useRxAsync } from 'use-rx-async';
import { Classes } from '@blueprintjs/core';
import { ButtonPopover } from '../../components/ButtonPopover';
import { ProductDialog } from './ProductDialog';
import { createProduct as createProductAPI } from '../../services';
import { useProductActions } from '../../store';
import { Param$CreateProduct } from '../../typings';
import { useBoolean } from '../../hooks/useBoolean';

const title = 'Create Product';

export function CreateProduct() {
  const [isOpen, { on, off }] = useBoolean();

  const { createProduct } = useProductActions();

  const request = useCallback(
    async (params: Param$CreateProduct) => {
      const product = await createProductAPI(params).then(res => res.data.data);
      createProduct(product);
      off();
    },
    [off, createProduct]
  );

  const { run, loading } = useRxAsync(request, {
    defer: true
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
}

import React, { useCallback } from 'react';
import { useRxAsync } from 'use-rx-async';
import { ButtonPopover } from '../../components/ButtonPopover';
import { AsyncFnDialog } from '../../components/Dialog';
import { Schema$Product } from '../../typings';
import { useProductActions } from '../../store';
import { deleteProduct as deleteProductAPI } from '../../services';
import { useBoolean } from '../../hooks/useBoolean';

const title = 'Delete Product';

export function DeleteProduct({
  id = '',
  name
}: Pick<Partial<Schema$Product>, 'id' | 'name'>) {
  const [isOpen, { on, off }] = useBoolean();
  const { deleteProduct } = useProductActions();

  const request = useCallback(() => deleteProductAPI({ id }), [id]);

  const onSuccess = useCallback(() => {
    deleteProduct({ id });
    off();
  }, [id, deleteProduct, off]);

  const { run, loading } = useRxAsync(request, { defer: true, onSuccess });

  return (
    <>
      <ButtonPopover minimal icon="trash" content={title} onClick={on} />
      <AsyncFnDialog
        icon="trash"
        intent="danger"
        title={title}
        onClose={off}
        isOpen={isOpen}
        loading={loading}
        onConfirm={run}
      >
        Are yout sure to delete <b>{name}</b> ?
      </AsyncFnDialog>
    </>
  );
}

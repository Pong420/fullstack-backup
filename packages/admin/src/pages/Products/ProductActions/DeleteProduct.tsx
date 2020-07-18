import React from 'react';
import { IconName } from '@blueprintjs/core';
import { deleteProduct } from '@fullstack/common/service';
import { ButtonPopover } from '../../../components/ButtonPopover';
import { openConfirmDialog } from '../../../components/ConfirmDialog';
import { Toaster } from '../../../utils/toaster';

export interface OnDelete {
  onDelete: ({ id }: { id: string }) => void;
}

interface DeleteProductProps extends OnDelete {
  id?: string;
  name?: string;
}

const icon: IconName = 'trash';
const title = 'Delete User';
export function DeleteProduct({ id = '', name, onDelete }: DeleteProductProps) {
  async function onConfirm() {
    try {
      await deleteProduct({ id });
      onDelete({ id });
      Toaster.success({ message: 'Delete product success' });
    } catch (error) {
      Toaster.apiError('Delete product failure', error);
      throw error;
    }
  }

  return (
    <ButtonPopover
      minimal
      icon="trash"
      content={title}
      onClick={() =>
        openConfirmDialog({
          intent: 'danger',
          icon,
          title,
          onConfirm,
          children: (
            <span>
              Are yout sure to delete <b>{name}</b> ? This action is
              irreversible
            </span>
          )
        })
      }
    />
  );
}

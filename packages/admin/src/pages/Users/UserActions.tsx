import React from 'react';
import { Button } from '@blueprintjs/core';
import { useConfirmDialog } from '../../components/ConfirmDialog';
import { Toaster } from '../../utils/toaster';
import { deleteUser } from '../../service';

export interface OnDelete {
  onDelete: ({ id }: { id: string }) => void;
}

interface DeleteUserProps extends OnDelete {
  id: string;
  nickname: string;
}

const onFailure = Toaster.apiError.bind(Toaster, 'Delete user failure');

export function DeleteUser({ nickname, id, onDelete }: DeleteUserProps) {
  const { openConfirmDialog } = useConfirmDialog();
  return (
    <Button
      icon="trash"
      onClick={() =>
        openConfirmDialog({
          icon: 'trash',
          title: 'Delete User',
          intent: 'danger',
          onFailure,
          onConfirm: () => deleteUser({ id }).then(() => onDelete({ id })),
          children: (
            <span>
              Are you sure to delete <b>{nickname}</b>'s account? This action is
              irreversible
            </span>
          )
        })
      }
    />
  );
}

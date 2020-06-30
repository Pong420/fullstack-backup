import React from 'react';
import { Button, IconName } from '@blueprintjs/core';
import { openConfirmDialog } from '../../components/ConfirmDialog';
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

const icon: IconName = 'trash';
export function DeleteUser({ nickname, id, onDelete }: DeleteUserProps) {
  return (
    <Button
      icon={icon}
      onClick={() =>
        openConfirmDialog({
          icon,
          intent: 'danger',
          title: 'Delete User',
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

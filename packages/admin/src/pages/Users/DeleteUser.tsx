import React from 'react';
import { openConfirmDialog } from '../../components/ConfirmDialog';
import { ButtonPopover, IconName } from '../../components/ButtonPopover';
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
const title = 'Delete User';
export function DeleteUser({ nickname, id, onDelete }: DeleteUserProps) {
  return (
    <ButtonPopover
      icon={icon}
      content={title}
      onClick={() =>
        openConfirmDialog({
          intent: 'danger',
          icon,
          title,
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

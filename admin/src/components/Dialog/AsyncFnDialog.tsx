import React, { ReactNode } from 'react';
import {
  Dialog,
  IDialogProps,
  Classes,
  Button,
  Intent
} from '@blueprintjs/core';
import { DIALOG_FOOTER_ACTIONS } from '@blueprintjs/core/lib/esm/common/classes';

export interface AsyncFnDialogProps extends IDialogProps {
  children?: ReactNode;
  cancelButtonText?: string;
  confirmButtonText?: string;
  intent?: Intent;
  loading?: boolean;
  onConfirm?: () => void;
}

export const AsyncFnDialog = React.memo(
  ({
    intent,
    children,
    onClose,
    onConfirm,
    loading,
    className = '',
    cancelButtonText = 'Cancel',
    confirmButtonText = 'Confirm',
    ...props
  }: AsyncFnDialogProps) => {
    return (
      <Dialog
        className={`async-dialog ${className}`.trim()}
        onClose={onClose}
        canEscapeKeyClose={!loading}
        canOutsideClickClose={!loading}
        {...props}
      >
        <div className={Classes.DIALOG_BODY}>{children}</div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={DIALOG_FOOTER_ACTIONS}>
            <Button disabled={loading} onClick={onClose}>
              {cancelButtonText}
            </Button>
            <Button intent={intent} loading={loading} onClick={onConfirm}>
              {confirmButtonText}
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
);

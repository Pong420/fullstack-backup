import React, { ReactNode, useCallback } from 'react';
import { useRxAsync } from 'use-rx-hooks';
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
  asyncFn: () => Promise<any>;
  onConfirm?: () => void;
  onSuccess?: (data: any) => void;
}

export const AsyncFnDialog = React.memo(
  ({
    intent,
    children,
    onSuccess,
    onClose,
    onConfirm,
    asyncFn,
    className = '',
    cancelButtonText = 'Cancel',
    confirmButtonText = 'Confirm',
    ...props
  }: AsyncFnDialogProps) => {
    const onSuccessCallback = useCallback(
      (data: any) => {
        onClose && onClose();
        onSuccess && onSuccess(data);
      },
      [onClose, onSuccess]
    );

    const { run, loading } = useRxAsync(asyncFn, {
      defer: true,
      onSuccess: onSuccessCallback
    });

    const onConfirmCallback = useCallback(() => {
      onConfirm && onConfirm();
      run();
    }, [onConfirm, run]);

    return (
      <Dialog
        {...props}
        className={`async-dialog ${className}`.trim()}
        onClose={onClose}
        canEscapeKeyClose={!loading}
        canOutsideClickClose={!loading}
      >
        <div className={Classes.DIALOG_BODY}>{children}</div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={DIALOG_FOOTER_ACTIONS}>
            <Button disabled={loading} onClick={onClose}>
              {cancelButtonText}
            </Button>
            <Button
              intent={intent}
              loading={loading}
              onClick={onConfirmCallback}
            >
              {confirmButtonText}
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
);

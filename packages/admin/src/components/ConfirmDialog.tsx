import React, {
  ReactNode,
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo
} from 'react';
import {
  Button,
  Classes,
  Dialog,
  IDialogProps,
  Intent
} from '@blueprintjs/core';
import { DIALOG_FOOTER_ACTIONS } from '@blueprintjs/core/lib/esm/common/classes';
import { useBoolean } from '@fullstack/common/hooks';
import { useRxAsync } from 'use-rx-hooks';
import { createOpenDialog } from '../utils/openDialog';

export interface ConfirmDialogProps extends IDialogProps {
  children?: ReactNode;
  intent?: Intent;
  onConfirm?: () => Promise<unknown>;
}

interface Context {
  openConfirmDialog: (props: Partial<ConfirmDialogProps>) => void;
}

const asyncFn = () => Promise.resolve();

const Context = createContext({} as Context);

export const useConfirmDialog = () => useContext(Context);

export const openConfirmDialog = createOpenDialog<ConfirmDialogProps>(
  ConfirmDialog
);

export const ConfirmDialogProvider: React.FC = ({ children }) => {
  const [props, setProps] = useState<Partial<ConfirmDialogProps>>();
  const [isOpen, open, close] = useBoolean();
  const { onClosed } = props || {};
  const value = useMemo<Context>(() => ({ openConfirmDialog: setProps }), []);

  useEffect(() => {
    props && open();
  }, [props, open]);

  return (
    <Context.Provider value={value}>
      {children}
      {props && (
        <ConfirmDialog
          {...props}
          isOpen={isOpen}
          onClose={close}
          onClosed={(...args) => {
            onClosed && onClosed(...args);
            setProps(undefined);
          }}
        />
      )}
    </Context.Provider>
  );
};

export function ConfirmDialog({
  className,
  children,
  onClose,
  onConfirm,
  intent = 'primary',
  ...props
}: ConfirmDialogProps) {
  const [{ loading }, { fetch }] = useRxAsync(onConfirm || asyncFn, {
    defer: true,
    onSuccess: onClose
  });

  return (
    <Dialog
      {...props}
      onClose={onClose}
      canEscapeKeyClose={!loading}
      canOutsideClickClose={!loading}
      className={`async-dialog ${className}`.trim()}
    >
      <div className={Classes.DIALOG_BODY}>{children}</div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={DIALOG_FOOTER_ACTIONS}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button intent={intent} onClick={fetch} loading={loading}>
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

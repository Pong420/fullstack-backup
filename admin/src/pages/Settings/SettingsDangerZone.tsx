import React, { ReactNode, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRxInput, useRxAsync } from 'use-rx-hooks';
import { Button, Divider, IButtonProps } from '@blueprintjs/core';
import { SettingsSection } from './SettingsSection';
import { AsyncFnDialog } from '../../components/Dialog';
import { Password } from '../../components/Password';
import { ModifyPasswordDialog } from '../../components/ModifyPasswordDialog';
import { deleteAcctount } from '../../services';
import { authUserSelector, useAuthActions } from '../../store';
import { useBoolean } from '../../hooks/useBoolean';

interface RowProps {
  title?: string;
  desc?: string;
  children?: ReactNode;
}

const DangerButton = (props: IButtonProps) => {
  const [hover, setHover] = useBoolean();
  return (
    <Button
      intent={hover ? 'danger' : 'none'}
      onMouseEnter={setHover.on}
      onMouseLeave={setHover.off}
      {...props}
    />
  );
};

function Row({ title, desc, children }: RowProps) {
  return (
    <div>
      <div>
        <b>{title}</b> {desc}
      </div>
      <div>{children}</div>
    </div>
  );
}

function DeleteAccount() {
  const [isOpen, setIsOpen] = useBoolean();
  const [password, inputProps] = useRxInput();
  const { id } = useSelector(authUserSelector)!;
  const { logout } = useAuthActions();

  const request = useCallback(
    async (password: string) => {
      await deleteAcctount({ id, password });
      logout();
    },
    [id, logout]
  );

  const { run, loading } = useRxAsync(request, { defer: true });

  return (
    <>
      <DangerButton text="Delete Account" onClick={setIsOpen.on} />
      <AsyncFnDialog
        icon="trash"
        intent="danger"
        title="Delete Account"
        isOpen={isOpen}
        onClose={setIsOpen.off}
        loading={loading}
        disabled={!password}
        onConfirm={() => run(password)}
      >
        <div style={{ marginBottom: 5 }}>Enter your password:</div>
        <Password {...inputProps} />
      </AsyncFnDialog>
    </>
  );
}

function ModifyPassword() {
  const [isOpen, setIsOpen] = useBoolean();
  return (
    <>
      <DangerButton text="Modify Password" onClick={setIsOpen.on} />
      <ModifyPasswordDialog isOpen={isOpen} onClose={setIsOpen.off} />
    </>
  );
}

export function SettingsDangerZone() {
  return (
    <SettingsSection title="Danger Zone" className="settings-danger-zone">
      <div className="settings-danger-zone-content">
        <Row
          title="Modify Password"
          desc="To protect the information in your account, it is suggested to change your password periodically."
        >
          <ModifyPassword />
        </Row>

        <Divider />

        <Row
          title="Delete this Account"
          desc="Once you delete this account, there is no going back. Please be certain."
        >
          <DeleteAccount />
        </Row>
      </div>
    </SettingsSection>
  );
}

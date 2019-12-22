import React, { ReactNode, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRxInput, useRxAsync } from 'use-rx-hooks';
import { Button, Divider, IButtonProps } from '@blueprintjs/core';
import { SettingsSection } from './SettingsSection';
import { AsyncFnDialog } from '../../components/Dialog';
import { Password } from '../../components/Password';
import { ModifyPasswordDialog } from '../../components/ModifyPasswordDialog';
import { deleteAcctount } from '../../service';
import { authUserSelector, useAuthActions } from '../../store';
import { useBoolean } from '@fullstack/common/hooks/useBoolean';

interface RowProps {
  title?: string;
  desc?: string;
  children?: ReactNode;
}

const DangerButton = (props: IButtonProps) => {
  const [hover, on, off] = useBoolean();
  return (
    <Button
      intent={hover ? 'danger' : 'none'}
      onMouseEnter={on}
      onMouseLeave={off}
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
  const [isOpen, on, off] = useBoolean();
  const [password, inputProps] = useRxInput();
  const { id } = useSelector(authUserSelector)!;
  const { logout } = useAuthActions();

  const request = useCallback(() => deleteAcctount({ id, password }), [
    id,
    password
  ]);

  const { run, loading } = useRxAsync(request, {
    defer: true,
    onSuccess: logout
  });

  return (
    <>
      <DangerButton text="Delete Account" onClick={on} />
      <AsyncFnDialog
        icon="trash"
        intent="danger"
        title="Delete Account"
        isOpen={isOpen}
        onClose={off}
        loading={loading}
        disabled={!password}
        onConfirm={run}
      >
        <div style={{ marginBottom: 5 }}>Enter your password:</div>
        <Password {...inputProps} />
      </AsyncFnDialog>
    </>
  );
}

function ModifyPassword() {
  const [isOpen, on, off] = useBoolean();
  return (
    <>
      <DangerButton text="Modify Password" onClick={on} />
      <ModifyPasswordDialog isOpen={isOpen} onClose={off} />
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

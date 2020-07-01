import React, { ReactNode } from 'react';
import { Divider } from '@blueprintjs/core';
import { SettingsSection } from '../SettingsSection';
import { ModifyPassword } from './ModifyPassword';
import { DeleteAccount } from './DeleteAccount';

interface RowProps {
  title?: string;
  desc?: string;
  children?: ReactNode;
}

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

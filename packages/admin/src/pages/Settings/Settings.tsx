import React from 'react';
import { Card } from '@blueprintjs/core';
import { Layout } from '../../components/Layout';
import { SettingsProfile } from './SettingsProfile';
import { SettingsDangerZone } from './SettingsDangerZone';

export function Settings() {
  return (
    <Layout className="settings">
      <Card>
        <SettingsProfile />
        <SettingsDangerZone />
      </Card>
    </Layout>
  );
}

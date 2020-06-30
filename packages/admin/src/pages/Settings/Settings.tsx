import React from 'react';
import { Card } from '@blueprintjs/core';
import { Layout } from '../../components/Layout';
import { SettingsProfile } from './SettingsProfile';

export function Settings() {
  return (
    <Layout className="settings">
      <Card>
        <SettingsProfile />
      </Card>
    </Layout>
  );
}

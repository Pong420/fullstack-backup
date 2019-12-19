import React, { ReactNode } from 'react';
import { H4, Divider } from '@blueprintjs/core';

interface Props {
  className?: string;
  title?: string;
  children?: ReactNode;
}

export const SettingsSection = React.memo<Props>(
  ({ title, children, className = '' }) => {
    return (
      <div className={`settings-section ${className}`.trim()}>
        <H4 className="settings-section-title" children={title} />
        <Divider />
        <div className="settings-section-content">{children}</div>
      </div>
    );
  }
);

import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Button, Classes } from '@blueprintjs/core';
import { UserPopover } from './UserPopover';
import { authUserSelector } from '../../store';

interface Props {
  title?: ReactNode;
  children?: ReactNode;
}

export const Navbar = React.memo(({ title, children }: Props) => {
  const { nickname } = useSelector(authUserSelector) || {};

  return (
    <div className={Classes.NAVBAR}>
      <div className={[Classes.NAVBAR_GROUP, Classes.ALIGN_LEFT].join(' ')}>
        <div className={['nav-bar-title', Classes.NAVBAR_HEADING].join(' ')}>
          {title}
        </div>
      </div>

      <div className={[Classes.NAVBAR_GROUP, Classes.ALIGN_RIGHT].join(' ')}>
        {children}

        <div className={Classes.NAVBAR_DIVIDER} />

        <Button minimal icon="notifications" />

        <UserPopover nickname={nickname} />
      </div>
    </div>
  );
});

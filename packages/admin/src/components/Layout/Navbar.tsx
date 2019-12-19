import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Button, Popover, Classes } from '@blueprintjs/core';
import { UserMenu } from './UserMenu';
import { authUserSelector } from '../../store';

interface Props {
  title?: ReactNode;
  children?: ReactNode;
}

const UserPopover = React.memo<{ nickname?: string }>(({ nickname }) => (
  <Popover content={<UserMenu />} position="bottom-right">
    <Button minimal icon="user">
      <b>{nickname}</b>
    </Button>
  </Popover>
));

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

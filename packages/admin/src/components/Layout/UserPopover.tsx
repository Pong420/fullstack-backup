import React from 'react';
import { Button, Popover, Menu, MenuItem } from '@blueprintjs/core';
import { useAuthActions } from '../../store';

interface UserPopoverProps {
  nickname?: string;
}

const UserMenu = () => {
  const actions = useAuthActions();
  return (
    <Menu>
      <MenuItem text="Logout" icon="log-out" onClick={actions.logout} />
    </Menu>
  );
};

export const UserPopover = ({ nickname }: UserPopoverProps) => (
  <Popover content={<UserMenu />} position="bottom-right">
    <Button minimal icon="user">
      {nickname && <b>{nickname}</b>}
    </Button>
  </Popover>
);

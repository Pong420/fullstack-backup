import React from 'react';
import { Menu, MenuItem } from '@blueprintjs/core';
import { logout, useActions } from '../../store';

const actions = { logout };

export const UserMenu = React.memo(() => {
  const { logout } = useActions(actions);
  return (
    <Menu>
      <MenuItem text="Loout" icon="log-out" onClick={logout} />
    </Menu>
  );
});

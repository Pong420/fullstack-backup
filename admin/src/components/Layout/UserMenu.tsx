import React from 'react';
import { Menu, MenuItem } from '@blueprintjs/core';
import { useActions } from '../../hooks/useActions';
import { logout } from '../../store';

const actions = { logout };

export function UserMenu() {
  const { logout } = useActions(actions);

  return (
    <Menu>
      <MenuItem text="Loout" icon="log-out" onClick={logout} />
    </Menu>
  );
}

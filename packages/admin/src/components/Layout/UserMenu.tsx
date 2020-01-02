import React from 'react';
import { Menu, MenuItem } from '@blueprintjs/core';
import { logout, useActions } from '../../store';

export const UserMenu = React.memo(() => {
  const actions = useActions({ logout });
  return (
    <Menu>
      <MenuItem text="Loout" icon="log-out" onClick={actions.logout} />
    </Menu>
  );
});

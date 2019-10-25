import React, { ReactNode } from 'react';
import {
  Navbar as BpNavbar,
  Button,
  Alignment,
  Popover,
  Position
} from '@blueprintjs/core';
import { UserMenu } from './UserMenu';

interface Props {
  title?: ReactNode;
  children?: ReactNode;
}

export function Navbar({ title, children }: Props) {
  return (
    <BpNavbar>
      <BpNavbar.Group>
        <BpNavbar.Heading className="nav-bar-title">{title}</BpNavbar.Heading>
      </BpNavbar.Group>

      <BpNavbar.Group align={Alignment.RIGHT}>
        {children}
        <BpNavbar.Divider />

        <Button minimal icon="notifications" />

        <Popover content={<UserMenu />} position={Position.BOTTOM_RIGHT}>
          <Button minimal icon="user" />
        </Popover>
      </BpNavbar.Group>
    </BpNavbar>
  );
}

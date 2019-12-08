import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import {
  Navbar as BpNavbar,
  Button,
  Alignment,
  Popover,
  Position
} from '@blueprintjs/core';
import { UserMenu } from './UserMenu';
import { authUserSelector } from '../../store';

interface Props {
  title?: ReactNode;
  children?: ReactNode;
}

export const Navbar = React.memo(({ title, children }: Props) => {
  const { nickname } = useSelector(authUserSelector) || {};

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
          <Button minimal icon="user">
            <b>{nickname}</b>
          </Button>
        </Popover>
      </BpNavbar.Group>
    </BpNavbar>
  );
});

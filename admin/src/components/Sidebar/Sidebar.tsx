import React, { ReactNode } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { Icon, IconName } from '@blueprintjs/core';
import { PATHS } from '../../constants';
import { ReactComponent as Logo } from '../../assets/logo.svg';

interface SidebarItemProps {
  to: NavLinkProps['to'];
  icon: IconName;
  iconSize?: number;
  children?: ReactNode;
}

function SidebarItem({ to, icon, children, iconSize = 16 }: SidebarItemProps) {
  return (
    <NavLink to={to} exact className="sidebar-item">
      <div className="sidebar-item-body">
        <div className="icon">
          <Icon icon={icon} iconSize={iconSize} />
        </div>
        <span className="label">{children}</span>
      </div>
    </NavLink>
  );
}

export const Sidebar = React.memo(() => {
  return (
    <div className="sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-header">
          <Logo />
          <span>Blueprint</span>
        </div>
        <div className="sidebar-body">
          <SidebarItem to={PATHS.HOME} icon="home">
            Home
          </SidebarItem>
          <SidebarItem to={PATHS.ORDERS} icon="inbox">
            Orders
          </SidebarItem>
          <SidebarItem to={PATHS.PRODUCTS} icon="box">
            Products
          </SidebarItem>
          <SidebarItem to={PATHS.USERS} icon="user">
            Users
          </SidebarItem>
          <SidebarItem to={PATHS.SETTINGS} icon="cog">
            Settings
          </SidebarItem>
        </div>
      </div>
    </div>
  );
});

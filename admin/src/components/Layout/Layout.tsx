import React, { ReactNode, useMemo } from 'react';
import { IconName, Icon } from '@blueprintjs/core';
import { Navbar } from './Navbar';

interface Props {
  className?: string;
  children?: ReactNode;
  icon?: IconName;
  title?: ReactNode;
  navbar?: ReactNode;
}

export const Layout = React.forwardRef<HTMLDivElement, Props>(
  ({ className = '', icon, title, navbar, children }, ref) => {
    const Title = useMemo(
      () => (
        <>
          {icon && <Icon icon={icon} />}
          {title}
        </>
      ),
      [icon, title]
    );

    return (
      <div className={`layout ${className}`.trim()} ref={ref}>
        <Navbar title={Title}>{navbar}</Navbar>
        <div className="layout-content">{children}</div>
      </div>
    );
  }
);

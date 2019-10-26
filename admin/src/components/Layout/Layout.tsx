import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface Props {
  className?: string;
  children?: ReactNode;
  title?: string;
  navbar?: ReactNode;
}

export const Layout = React.forwardRef<HTMLDivElement, Props>(
  ({ className = '', title, navbar, children }, ref) => {
    return (
      <div className={`layout ${className}`.trim()} ref={ref}>
        <Navbar title={title}>{navbar}</Navbar>
        <div className="layout-content">{children}</div>
      </div>
    );
  }
);

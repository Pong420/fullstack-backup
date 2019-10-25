import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface Props {
  className?: string;
  children?: ReactNode;
}

export const Layout = React.forwardRef<HTMLDivElement, Props>(
  ({ className = '', children }, ref) => {
    return (
      <div className={`layout ${className}`.trim()} ref={ref}>
        <Navbar />
        <div className="layout-content">{children}</div>
      </div>
    );
  }
);

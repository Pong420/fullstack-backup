import React, { ReactNode } from 'react';

interface Props {
  className?: string;
  children?: ReactNode;
}

export const Layout = React.forwardRef<HTMLDivElement, Props>(
  ({ className = '', children }, ref) => {
    return (
      <div className={`layout ${className}`.trim()} ref={ref}>
        <div className="layout-content">{children}</div>
      </div>
    );
  }
);

import React, { HTMLAttributes } from 'react';
import { Classes } from '@blueprintjs/core';

interface Props extends HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
}

export const Skeleton = React.memo<Props>(
  React.forwardRef<HTMLDivElement, Props>(
    ({ className = '', children, animate = false, style, ...props }, ref) => {
      const show = typeof children === 'undefined';
      return (
        <div
          {...props}
          className={[
            className,
            show ? (animate ? Classes.SKELETON : 'skeleton') : ''
          ]
            .join(' ')
            .trim()}
          ref={ref}
          style={{
            ...style,
            backgroundColor: show && !animate ? '#e7e7e7' : undefined
          }}
        >
          {children}
        </div>
      );
    }
  )
);

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
            'skeleton',
            className,
            show && animate ? Classes.SKELETON : ''
          ]
            .join(' ')
            .trim()}
          ref={ref}
          style={{
            ...style,
            backgroundColor: show ? '#e7e7e7' : undefined
          }}
        >
          {children}
        </div>
      );
    }
  )
);

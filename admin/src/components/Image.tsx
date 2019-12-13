import React, { CSSProperties } from 'react';
import { ratio as DefaultRatio } from '../scss/_variables.scss';

interface Props {
  url?: string;
  ratio?: number;
  size?: CSSProperties['backgroundSize'];
  className?: string;
}

export const Image = React.memo<Props>(
  ({ url, ratio = DefaultRatio, className = '', size = 'cover' }) => {
    return (
      <div
        className={`large ${className}`.trim()}
        style={{
          backgroundColor: '#eee',
          backgroundImage: `url(${url})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: size,
          paddingBottom: `${ratio * 100}%`
        }}
      />
    );
  }
);

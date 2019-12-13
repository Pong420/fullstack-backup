import React, { CSSProperties } from 'react';
import { ratio as DefaultRatio } from '../scss/_variables.scss';

export interface ImageProps {
  url?: string;
  ratio?: number;
  size?: CSSProperties['backgroundSize'];
  className?: string;
  img?: boolean;
}

export const Image = React.memo<ImageProps>(
  ({
    url,
    ratio = DefaultRatio,
    className = '',
    size = 'cover',
    img = false
  }) => {
    if (img) {
      return <img src={url} alt={url} />;
    }

    return (
      <div
        className={`image ${className}`.trim()}
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

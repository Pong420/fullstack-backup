import React, { CSSProperties } from 'react';

interface Props {
  url?: string;
  ratio?: number;
  size?: CSSProperties['backgroundSize'];
}

export const Image = React.memo<Props>(
  ({ url, ratio = 617 / 925, size = 'cover' }) => {
    return (
      <div
        className="image"
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

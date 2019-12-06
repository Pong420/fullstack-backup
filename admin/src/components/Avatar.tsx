import React from 'react';
import jdenticon from 'jdenticon';

interface Props {
  avatar?: string | null;
  fallback?: string;
  size?: number;
}

export function Avatar({ size = 40, avatar, fallback }: Props) {
  const dimen = { width: size, height: size };
  let content = avatar ? (
    <div
      className="avatar-image"
      style={{
        ...dimen,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${avatar})`,
        backgroundPosition: 'center, center'
      }}
    />
  ) : fallback ? (
    <div
      dangerouslySetInnerHTML={{ __html: jdenticon.toSvg(fallback, size) }}
    />
  ) : null;

  return (
    <div className="avatar" style={dimen}>
      {content}
    </div>
  );
}

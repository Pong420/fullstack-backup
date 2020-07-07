import React from 'react';

export interface ImageProps {
  src?: string | null;
  size?: number;
  className?: string;
  background?: boolean;
  thumbnal?: boolean;
}

export function Image({
  src = '',
  size,
  className = '',
  thumbnal,
  background
}: ImageProps) {
  className = `image ${className}`.trim();
  src = src || '';

  if (thumbnal && src && /cloudinary.*.upload/.test(src)) {
    src = src.replace(
      'upload',
      'upload/c_thumb,g_face' + (size ? `,w_${size}` : '')
    );
  }

  if (!background && src) {
    return <img className={className} src={src} alt={src} />;
  }

  return (
    <div
      className={className}
      style={{
        backgroundImage: src && `url(${src})`
      }}
    />
  );
}

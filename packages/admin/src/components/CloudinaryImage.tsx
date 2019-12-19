import React from 'react';
import { Image, ImageProps } from './Image';
import { Cloudinary, Transformation } from 'cloudinary-core';

type Props = ImageProps &
  (Transformation | Transformation.Options) & {
    url?: string;
  };

const cloud_name = (process.env.REACT_APP_CLOUDINARY_URL || '/').replace(
  /.*@/,
  ''
);

if (cloud_name === '/') {
  console.warn('REACT_APP_CLOUDINARY_URL is not confugired');
}

const cloudinary = new Cloudinary({
  cloud_name,
  secure: true
});

export const CloudinaryImage = React.memo<Props>(
  ({ url, ratio, size, img, className, ...options }) => {
    const _url = url
      ? /^(http|data:image)/.test(url)
        ? url
        : cloudinary.url(url, { crop: 'limit', ...options })
      : url;

    return <Image url={_url} {...{ img, ratio, size, className }} />;
  }
);

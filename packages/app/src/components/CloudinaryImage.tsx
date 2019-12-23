import React from 'react';
import { View, Image, ViewStyle } from 'react-native';
import { Cloudinary, Transformation } from 'cloudinary-core';

type Props = Omit<Transformation.Options, 'size'> & {
  id?: string;
  size: number;
  style?: ViewStyle;
};

const cloud_name = (process.env.REACT_APP_CLOUDINARY_URL || '/').replace(
  /.*@/,
  ''
);

const cloudinary = new Cloudinary({
  cloud_name,
  secure: true
});

export function CloudinaryImage({ id, style, size, ...options }: Props) {
  const uri =
    id &&
    cloudinary.url(id, { crop: 'limit', width: String(size * 2), ...options });

  return (
    <View style={{ width: size, height: size, ...style }}>
      <Image style={{ flex: 1 }} source={{ uri }} />
    </View>
  );
}

import React from 'react';
import { ViewProps, View } from 'react-native';
import { Button, ButtonProps } from './Button';

interface Props extends Omit<ViewProps, 'children'> {
  buttons?: ButtonProps[];
}

export function ButtonGroup({ buttons = [], ...props }: Props) {
  return (
    <View {...props}>
      {buttons.map(({ style, ...props }, index) => (
        <Button
          key={index}
          style={{ marginTop: index && 15, ...style }}
          {...props}
        />
      ))}
    </View>
  );
}

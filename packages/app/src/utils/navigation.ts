import React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

export const navigationRef = React.createRef<NavigationContainerRef>();

export function navigate(name: string, params?: Record<string, unknown>) {
  navigationRef.current?.navigate(name, params);
}

import React, { useState, useEffect } from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { enableScreens } from 'react-native-screens';
import { Login } from './src/pages/Login';
import { fonts } from './src/components/Text';
import * as Font from 'expo-font';

enableScreens();

const SCREENS = {
  Login: { screen: Login }
};

const Route = createSwitchNavigator(SCREENS, {
  initialRouteName: 'Login'
});

const App = createAppContainer(Route);

export default () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  useEffect(() => {
    Font.loadAsync(fonts).then(() => setFontLoaded(true));
  }, []);

  return fontLoaded && <App />;
};

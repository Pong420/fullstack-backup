import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { enableScreens } from 'react-native-screens';
import { Login } from './src/pages/Login';
import { fonts } from './src/components/Text';
import { configureStore } from './src/store';
import * as Font from 'expo-font';

enableScreens();

const store = configureStore();

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

  if (fontLoaded) {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }

  return null;
};

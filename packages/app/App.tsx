import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { enableScreens } from 'react-native-screens';
import { fonts } from './src/components/Text';
import { SCREENS } from './src/constants';
import { configureStore } from './src/store';
import { setTopLevelNavigator } from './src/utils/navigation';
import * as Font from 'expo-font';

enableScreens();

const store = configureStore();

const Routes = createSwitchNavigator(SCREENS, {
  initialRouteName: 'Login'
});

const Navigation = createAppContainer(Routes);

export default () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync(fonts).then(() => setFontLoaded(true));
  }, []);

  if (fontLoaded) {
    return (
      <Provider store={store}>
        <Navigation ref={setTopLevelNavigator} />
      </Provider>
    );
  }

  return null;
};

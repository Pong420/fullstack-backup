import React, { useState, useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { SplashScreen } from 'expo';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { enableScreens } from 'react-native-screens';
import { fonts } from './src/components/Text';
import { SCREENS } from './src/constants';
import { configureStore, loginStatusSelector } from './src/store';
import { setTopLevelNavigator } from './src/utils/navigation';
import * as Font from 'expo-font';

enableScreens();
SplashScreen.preventAutoHide();

const store = configureStore();

const Routes = createSwitchNavigator(SCREENS, {
  initialRouteName: 'Login'
});

const Navigation = createAppContainer(Routes);

function App() {
  const loginStatus = useSelector(loginStatusSelector);

  useEffect(() => {
    (loginStatus === 'loggedIn' || loginStatus === 'required') &&
      SplashScreen.hide();
  }, [loginStatus]);

  return <Navigation ref={setTopLevelNavigator} />;
}

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

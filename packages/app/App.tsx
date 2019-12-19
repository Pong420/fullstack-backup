import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { enableScreens } from 'react-native-screens';
import { Login } from './src/pages/Login';

enableScreens();

const SCREENS = {
  Login: { screen: Login }
};

const App = createSwitchNavigator(SCREENS, {
  initialRouteName: 'Login'
});

export default createAppContainer(App);

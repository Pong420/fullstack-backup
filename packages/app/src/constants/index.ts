import { Login } from '../pages/Login';
import { Home } from '../pages/Home';

export type Screens = keyof typeof SCREENS;

export const SCREENS = {
  Login: { screen: Login },
  Home: { screen: Home }
};

import { Linking } from 'react-native';
import { toaster } from '../../components/Toast';
import { navigate } from '../../utils/navigation';
import Languages from '../../assets/languages.svg';

const githubUrl = 'https://github.com/Pong420/fullstack';

export enum Paths {
  User = 'User',
  PeronsalInfo = 'Personal Information',
  ChangePassword = 'Change Password',
  Login = 'Login',
  Registration = 'Registration',
  VaildatePassword = 'VaildatePassword'
}

export const DATA = [
  {
    auth: true,
    icon: 'user',
    title: 'Personal Information',
    onPress: () => navigate(Paths.VaildatePassword)
  },
  {
    auth: true,
    icon: 'lock',
    title: 'Change Password',
    onPress: () => navigate(Paths.ChangePassword)
  },
  {
    auth: true,
    icon: 'file-text',
    title: 'My Orders'
  },
  {
    auth: true,
    icon: 'map-pin',
    title: 'Delivery Address'
  },
  {
    icon: 'message-circle',
    title: 'Contact Us'
  },
  {
    icon: Languages,
    title: 'Languages'
  },
  {
    icon: 'github',
    title: 'Github',
    onPress: () =>
      Linking.canOpenURL(githubUrl)
        .then(supported => {
          if (supported) {
            return Linking.openURL(githubUrl);
          }
          throw new Error('Open external URI is not supported');
        })
        .catch(error => toaster.apiError('Open url failure', error))
  }
];

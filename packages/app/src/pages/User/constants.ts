import { Linking } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { toaster } from '../../components/Toast';
import { navigate } from '../../utils/navigation';
import Languages from '../../assets/languages.svg';

const githubUrl = 'https://github.com/Pong420/fullstack';

export type UserStackParamList = {
  User: undefined;
  PeronsalInfo: undefined;
  ChangePassword: undefined;
  DeliveryAddress: undefined;
  Login: undefined;
  Registration: undefined;
};

export type UserStackScreenProps<
  T extends keyof UserStackParamList
> = StackScreenProps<UserStackParamList, T>;

export const DATA = [
  {
    auth: true,
    icon: 'user',
    title: 'Personal Information',
    onPress: () => navigate('VaildatePassword')
  },
  {
    auth: true,
    icon: 'lock',
    title: 'Change Password',
    onPress: () => navigate('ChangePassword')
  },
  {
    auth: true,
    icon: 'package',
    title: 'My Orders'
  },
  {
    auth: true,
    icon: 'map-pin',
    title: 'Delivery Address',
    onPress: () => navigate('DeliveryAddress')
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

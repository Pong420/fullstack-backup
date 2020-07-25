import React from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  ListRenderItem,
  Linking,
  TouchableOpacity
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Bold, SemiBold } from '../../components/Text';
import { useAuth, IAuthContext } from '../../hooks/useAuth';
import { toaster } from '../../components/Toast';
import { Button } from '../../components/Button';
import { navigate } from '../../utils/navigation';
import Languages from '../../assets/languages.svg';

const githubUrl = 'https://github.com/Pong420/fullstack';

const DATA = [
  {
    auth: true,
    icon: 'user',
    title: 'Personal Information'
  },
  {
    auth: true,
    icon: 'lock',
    title: 'Change Password',
    onPress: () => navigate('Change Password')
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

function Header({ user, logout }: Pick<IAuthContext, 'user' | 'logout'>) {
  return (
    <View style={styles.header}>
      <Bold fontSize={24}>Hi, {user?.nickname}</Bold>
      <SemiBold fontSize={18} onPress={() => logout()}>
        Logout
      </SemiBold>
    </View>
  );
}

function Footer() {
  const navigation = useNavigation();
  return (
    <View style={styles.footer}>
      <Button
        title="Login"
        intent="DARK"
        onPress={() => navigation.navigate('Login')}
      />
      <Button
        ghost
        title="Register"
        intent="DARK"
        style={styles.register}
        onPress={() => navigation.navigate('Registration')}
      />
    </View>
  );
}

const iconSize = 26;
const iconColor = '#182026';
const workingInProgress = () =>
  toaster.info({
    message: 'This feature is working in progress'
  });
function Item({
  title,
  icon: Icon,
  onPress,
  auth
}: Omit<typeof DATA[number], 'id'>) {
  const { loginStatus } = useAuth();

  if (auth && loginStatus !== 'loggedIn') {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress || workingInProgress}
    >
      {typeof Icon === 'string' ? (
        <Feather name={Icon} size={iconSize} color={iconColor} />
      ) : (
        <Icon width={iconSize} height={iconSize} color={iconColor} />
      )}
      <Text style={styles.title}>{title}</Text>
      <Feather name="chevron-right" size={iconSize} color="#666" />
    </TouchableOpacity>
  );
}

const renderItem: ListRenderItem<typeof DATA[number]> = ({ item }) => (
  <Item {...item} />
);

export function UserConentList() {
  const { loginStatus, user, logout } = useAuth();
  const loggedIn = loginStatus === 'loggedIn';
  return (
    <>
      <SafeAreaView style={styles.grow}>
        <FlatList
          style={styles.list}
          data={DATA}
          ListHeaderComponent={
            loggedIn ? <Header user={user} logout={logout} /> : null
          }
          renderItem={renderItem}
          alwaysBounceVertical={false}
          bounces={false}
          keyExtractor={item => item.title}
        />
      </SafeAreaView>
      {!loggedIn && <Footer />}
    </>
  );
}

const containerPadding = 24;
const styles = StyleSheet.create({
  grow: { flexGrow: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 30
  },
  list: {
    padding: containerPadding
  },
  footer: {
    flexGrow: 0,
    padding: containerPadding
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    marginBottom: 15
  },
  title: {
    fontSize: 20,
    marginLeft: 15,
    flex: 1
  },
  register: { marginTop: 15 }
});

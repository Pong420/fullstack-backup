import React from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  ListRenderItem,
  TouchableOpacity
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Bold, SemiBold } from '@/components/Text';
import { useAuth, IAuthContext } from '@/hooks/useAuth';
import { toaster } from '@/components/Toast';
import { Button } from '@/components/Button';
import { containerPadding, colors } from '@/styles';
import { DATA } from './constants';

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
const iconColor = colors.black;
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
    <TouchableOpacity onPress={onPress || workingInProgress}>
      <View style={{ ...styles.item, opacity: onPress ? undefined : 0.5 }}>
        {typeof Icon === 'string' ? (
          <Feather name={Icon} size={iconSize} color={iconColor} />
        ) : (
          <Icon width={iconSize} height={iconSize} color={iconColor} />
        )}
        <Text style={styles.title}>{title}</Text>
        <Feather name="chevron-right" size={iconSize} color="#666" />
      </View>
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
    paddingVertical: 15,
    marginBottom: 15
  },
  title: {
    fontSize: 20,
    marginLeft: 15,
    flex: 1
  },
  register: { marginTop: 15 }
});

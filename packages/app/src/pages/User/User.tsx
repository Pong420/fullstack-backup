import React from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  ListRenderItem,
  Linking,
  TouchableOpacity
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Bold, SemiBold } from '../../components/Text';
import { paddingX, paddingY, dimen } from '../../styles';
import { useAuth } from '../../hooks/useAuth';
import Languages from '../../assets/languages.svg';
import { toaster } from '../../components/Toast';

const githubUrl = 'https://github.com/Pong420/fullstack';

const DATA = [
  {
    icon: 'user',
    title: 'Personal Information'
  },
  {
    icon: 'lock',
    title: 'Change Password'
  },
  {
    icon: 'file-text',
    title: 'My Orders'
  },
  {
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
          throw new Error("Don't know how to open URI");
        })
        .catch(error => toaster.apiError('Open url failure', error))
  }
];

function Header() {
  const { user, logout } = useAuth();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        ...paddingX(20),
        ...paddingY(30)
      }}
    >
      <Bold fontSize={24}>Hi, {user?.nickname}</Bold>
      <SemiBold fontSize={18} onPress={logout}>
        Logout
      </SemiBold>
    </View>
  );
}

const iconSize = 26;
const iconColor = '#182026';
const workingInProgress = () =>
  toaster.warn({
    message: 'This feature is working in progress'
  });
function Item({ title, icon: Icon, onPress }: Omit<typeof DATA[number], 'id'>) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress || workingInProgress}
    >
      {typeof Icon === 'string' ? (
        <Feather name={Icon} size={iconSize} color={iconColor} />
      ) : (
        <Icon {...dimen(iconSize)} color={iconColor} />
      )}
      <Text style={styles.title}>{title}</Text>
      <Feather name="chevron-right" size={iconSize} color="#666" />
    </TouchableOpacity>
  );
}

const renderItem: ListRenderItem<typeof DATA[number]> = ({ item }) => (
  <Item {...item} />
);

export function User() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        ListHeaderComponent={Header}
        renderItem={renderItem}
        alwaysBounceVertical={false}
        bounces={false}
        keyExtractor={item => item.title}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    marginHorizontal: 20,
    marginBottom: 15
  },
  title: {
    fontSize: 20,
    marginLeft: 15,
    flex: 1
  }
});

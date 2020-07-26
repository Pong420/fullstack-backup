import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text, SemiBold } from '../../../components/Text';
import { Header } from '../../../components/Header';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { Paths } from '../constants';
import { StackScreenProps } from '@react-navigation/stack';
import { useAuth } from '../../../hooks/useAuth';

interface ItemProps {
  label: string;
  value?: string;
  onEdit?: () => void;
}

function Item({ label, value, onEdit }: ItemProps) {
  return (
    <View style={styles.item}>
      <Text style={styles.itemLabel} fontSize={14}>
        {label}
      </Text>
      <View style={styles.itemValue}>
        <Text>{value}</Text>
        {typeof onEdit !== 'undefined' && (
          <TouchableNativeFeedback onPress={onEdit}>
            <Feather name="edit" size={16} />
          </TouchableNativeFeedback>
        )}
      </View>
    </View>
  );
}

export function PersonalInfo({
  navigation
}: StackScreenProps<Record<string, undefined>>) {
  const { user } = useAuth();
  return (
    <>
      <Header title="Personal Infomation" />
      <View style={styles.container}>
        <View style={styles.card}>
          <SemiBold>Account Information</SemiBold>
          <Item
            label="Username"
            value={user?.username.substring(0, 3) + '*******'}
          />
          <Item
            label="Nickname"
            value={user?.nickname}
            onEdit={() => navigation.navigate(Paths.NewNickName)}
          />
          <Item
            label="Email address"
            value={user?.email}
            onEdit={() => navigation.navigate(Paths.NewEmail)}
          />
        </View>
      </View>
    </>
  );
}

const containerPadding = 24;
const styles = StyleSheet.create({
  container: { flex: 1, padding: containerPadding, paddingTop: 0 },
  card: {
    padding: containerPadding,
    borderRadius: 3,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  },
  item: {
    marginTop: 20
  },
  itemLabel: {
    color: '#8a9ba8'
  },
  itemValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

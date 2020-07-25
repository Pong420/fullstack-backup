import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { Text, SemiBold } from '../../components/Text';
import { Button } from '../../components/Button';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { navigate } from '../../utils/navigation';

interface ItemProps {
  label: string;
  value: string;
  edit?: string;
}

const Stack = createStackNavigator();

function Item({ label, value, edit }: ItemProps) {
  return (
    <View style={styles.item}>
      <Text style={styles.itemLabel} fontSize={14}>
        {label}
      </Text>
      <View style={styles.itemValue}>
        <Text>{value}</Text>
        {typeof edit !== 'undefined' && (
          <TouchableNativeFeedback>
            <Feather name="edit" size={16} />
          </TouchableNativeFeedback>
        )}
      </View>
    </View>
  );
}

function AuthScreen() {
  return (
    <View>
      <Button title="Test" onPress={() => navigate('ContentScreen')}></Button>
    </View>
  );
}

function MainStackScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <SemiBold>Account Information</SemiBold>
        <Item label="Username" value="sam***" />
        <Item label="Nickname" value="sam***" />
        <Item label="Email address" value="s********@gamil.com" />
      </View>
    </View>
  );
}

export function PersonalInfo() {
  return (
    <Stack.Navigator mode="modal" headerMode="screen">
      <Stack.Screen name="MainStackScreen" component={MainStackScreen} />
      <Stack.Screen name="AuthScreen" component={AuthScreen} />
    </Stack.Navigator>
  );
}

const contianerPadding = 24;
const styles = StyleSheet.create({
  container: { flex: 1, padding: contianerPadding, paddingTop: 0 },
  card: {
    padding: 15,
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

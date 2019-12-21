import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  Keyboard
} from 'react-native';
import { LoginForm } from './LoginForm';
import { Text } from '../../components/Text';
import { flex, dimen } from '../../styles';
import Cart from '../../assets/cart.svg';

export function Login() {
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ ...dimen('100%') }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 50
            }}
          >
            <Text fontFamily="ink-painting" fontSize={70}>
              Buyar
            </Text>
            <View style={{ marginTop: 40, marginLeft: -10 }}>
              <Cart style={{ ...dimen(30) }} color="#000"></Cart>
            </View>
          </View>
          <LoginForm
            onSuccess={() => alert('done')}
            onFailure={() => alert('fail')}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...flex({ alignItems: 'flex-start', justifyContent: 'center' }),
    backgroundColor: '#fff'
  }
});

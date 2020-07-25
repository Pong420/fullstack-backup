import React, { ComponentType } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { InkPainting } from '../../components/Text';
import { Button } from '../../components/Button';
import {
  KeyboardAvoidingView,
  ScrollView
} from '../../components/KeyboardAvoidingView';
import { useAuth, IAuthContext } from '../../hooks/useAuth';
import { createForm, FormProps } from '../../utils/form';

export interface AuthFormProps<T> extends Omit<FormProps<T>, 'onFinish'> {
  onFinish: IAuthContext['authenticate'];
}

interface Props<T> {
  title: string;
  form: ComponentType<AuthFormProps<T>>;
}

export function createAuthPage<T>({ title, form: Form }: Props<T>) {
  const { useForm } = createForm<T>();

  return function () {
    const navigation = useNavigation();
    const { loginStatus, authenticate } = useAuth();
    const [form] = useForm();

    loginStatus === 'loggedIn' && navigation.goBack();

    return (
      <KeyboardAvoidingView>
        <View style={styles.container}>
          <ScrollView style={styles.scrollViewContent}>
            <View style={styles.logo}>
              <InkPainting fontSize={70}>{title}</InkPainting>
            </View>

            <Form form={form} onFinish={authenticate} />
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Button
              intent="DARK"
              title={title}
              onPress={form.submit}
              loading={loginStatus === 'loading'}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };
}

const contianerPadding = 24;
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollViewContent: { paddingHorizontal: contianerPadding },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20
  },
  buttonContainer: {
    padding: contianerPadding
  }
});

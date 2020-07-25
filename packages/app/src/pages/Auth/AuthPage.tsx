import React, { ComponentType } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Header } from '../../components/Header';
import { InkPainting } from '../../components/Text';
import { Button } from '../../components/Button';
import { KeyboardAvoidingViewFooter } from '../../components/KeyboardAvoidingViewFooter';
import { useAuth } from '../../hooks/useAuth';
import { createForm } from '../../utils/form';
import { Param$Login, Param$CreateUser } from '@fullstack/typings';

interface Props {
  title: string;
  content: ComponentType<unknown>;
}

export type { Param$Login };
export type Param$Registration = Required<
  Param$CreateUser & { confirmPassword: string }
>;

type Schema = Param$Login | Param$Registration;

export function createAuthPage<T extends Schema>({
  title,
  content: Content
}: Props) {
  const { Form, useForm } = createForm<T>();

  return function ({ navigation }: StackScreenProps<{}>) {
    const { loginStatus, authenticate } = useAuth();
    const [form] = useForm();

    loginStatus === 'loggedIn' && navigation.goBack();

    return (
      <Form style={styles.container} form={form} onFinish={authenticate}>
        <Header title="Go Back" />
        <ScrollView bounces={false} style={styles.scrollViewContent}>
          <View style={styles.logo}>
            <InkPainting fontSize={70}>{title}</InkPainting>
          </View>

          <Content />
        </ScrollView>
        <KeyboardAvoidingViewFooter style={styles.buttonContainer}>
          <Button
            intent="DARK"
            title={title}
            onPress={form.submit}
            loading={loginStatus === 'loading'}
          />
        </KeyboardAvoidingViewFooter>
      </Form>
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

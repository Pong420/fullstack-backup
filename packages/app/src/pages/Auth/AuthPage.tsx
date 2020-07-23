import React, { ComponentType } from 'react';
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  View,
  Platform,
  StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { dimen } from '../../styles';
import { Button } from '../../components/Button';
import { InkPainting } from '../../components/Text';
import { useAuth, IAuthContext } from '../../hooks/useAuth';

export interface AuthFormProps {
  loading?: boolean;
  onSubmit: IAuthContext['authorize'];
}

interface Props {
  title: string;
  form: ComponentType<AuthFormProps>;
}

export function createAuthPage({ title, form: Form }: Props) {
  return function () {
    const navigation = useNavigation();
    const { loginStatus, authorize } = useAuth();

    loginStatus === 'loggedIn' && navigation.goBack();

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
      >
        <SafeAreaView style={styles.container}>
          <ScrollView
            alwaysBounceVertical={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.grow}
          >
            <View style={styles.logo}>
              <InkPainting fontSize={70}>{title}</InkPainting>
            </View>

            <View style={styles.footer}>
              <View style={styles.grow}>
                <Form onSubmit={authorize} />
              </View>
              <Button
                onPress={navigation.goBack}
                style={styles.goback}
                title="Go Back"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  };
}

const styles = StyleSheet.create({
  container: { ...dimen('100%'), backgroundColor: '#fff' },
  logo: {
    marginVertical: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  grow: { flexGrow: 1 },
  footer: { padding: 20, flexGrow: 1 },
  goback: { marginTop: 15 }
});

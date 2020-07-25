import React, { ComponentType } from 'react';
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  View,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { dimen } from '../../styles';
import { SemiBold, InkPainting } from '../../components/Text';
import { useAuth, IAuthContext } from '../../hooks/useAuth';

export interface AuthFormProps {
  loading?: boolean;
  onSubmit: IAuthContext['authenticate'];
}

interface Props {
  title: string;
  form: ComponentType<AuthFormProps>;
}

export function createAuthPage({ title, form: Form }: Props) {
  return function () {
    const navigation = useNavigation();
    const { loginStatus, authenticate } = useAuth();

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
            <TouchableWithoutFeedback onPress={navigation.goBack}>
              <View style={styles.goback}>
                <Feather name="chevron-left" size={24} />
                <SemiBold fontSize={16} style={{ lineHeight: 24 }}>
                  Go Back
                </SemiBold>
              </View>
            </TouchableWithoutFeedback>

            <View style={styles.logo}>
              <InkPainting fontSize={70}>{title}</InkPainting>
            </View>

            <View style={styles.footer}>
              <View style={styles.grow}>
                <Form onSubmit={authenticate} />
              </View>
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
  goback: {
    flexDirection: 'row',
    marginTop: 15,
    marginLeft: 15,
    marginBottom: 15
  }
});

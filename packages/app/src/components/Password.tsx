import React from 'react';
import {
  View,
  TouchableHighlight,
  StyleSheet,
  TextInput as RNTextInput
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TextInput, TextInputProps } from './TextInput';
import { useBoolean } from '../hooks/useBoolean';
import { dimen } from '../styles';

interface Props extends TextInputProps {
  visible?: boolean;
}

export const Password = React.forwardRef<RNTextInput, Props>(
  ({ visible, ...props }, ref) => {
    const [secureTextEntry, , , toggle] = useBoolean(!visible);
    return (
      <TextInput
        ref={ref}
        textContentType="password"
        autoCompleteType="password"
        secureTextEntry={secureTextEntry}
        rightElement={
          <TouchableHighlight onPress={toggle} underlayColor="transparent">
            <View style={styles.view}>
              <Feather
                name={secureTextEntry ? 'eye-off' : 'eye'}
                onPress={toggle}
                size={18}
              />
            </View>
          </TouchableHighlight>
        }
        {...props}
      />
    );
  }
);

const styles = StyleSheet.create({
  view: {
    ...dimen(30),
    alignItems: 'center',
    justifyContent: 'center'
  }
});

import React, { useState } from 'react';
import { StyleSheet, Platform, Keyboard } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  TextInput,
  TextInputProps,
  RNTextInput,
  RNTextInputProps,
  TEXT_INPUT_ICON_SIZE
} from '@/components/TextInput';

export type { RNTextInput, RNTextInputProps };

export const SearchInput = React.forwardRef<RNTextInput, TextInputProps>(
  ({ style, value: controlledValue, onChange, ...props }, ref) => {
    const [search, setSearch] = useState(controlledValue);
    const value = controlledValue || search;
    const handleChange = onChange || setSearch;

    return (
      <TextInput
        ref={ref}
        leftIcon="search"
        value={value}
        onChange={handleChange}
        style={[styles.searchInput, style]}
        clearButtonMode="while-editing"
        rightElement={
          Platform.OS === 'android' && value ? (
            <Feather
              name="x"
              size={TEXT_INPUT_ICON_SIZE}
              style={styles.clearSearch}
              onPress={() => {
                handleChange('');
                Keyboard.dismiss();
              }}
            />
          ) : undefined
        }
        {...props}
      />
    );
  }
);

const styles = StyleSheet.create({
  searchInput: {
    fontSize: 16
  },
  clearSearch: {
    color: '#666'
  }
});

import React, { useState } from 'react';
import {
  Text,
  Modal,
  View,
  StyleSheet,
  FlatList,
  TouchableNativeFeedback
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeArea } from 'react-native-safe-area-context';
// `TouchableWithoutFeedback` import from `react-native` not work on TextInput
// `onTouchStart` / `onTouchEnd` props of `TextInput` work
// but cannot not unfocused another `TextInput`
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useBoolean } from '../hooks/useBoolean';
import { containerPadding, colors } from '../styles';
import { TextInput, TextInputProps } from './TextInput';
import { ModalHeader } from './PageModal';

export interface SelectValue {
  value: string;
  label: string;
}

export interface SelectProps extends TextInputProps {
  title?: string;
  value?: string;
  editable?: boolean;
  options: SelectValue[];
  onChange?: (value: string) => void;
}

interface ItemProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

const chevronDown = <Feather name="chevron-down" size={20} />;

function Divider() {
  return <View style={styles.divider} />;
}

const Item = ({ label, selected, onPress }: ItemProps) => {
  return (
    <TouchableNativeFeedback onPress={onPress}>
      <View style={styles.item}>
        <Text>{label}</Text>
        {selected && <Feather name="check" size={20} style={styles.itemIcon} />}
      </View>
    </TouchableNativeFeedback>
  );
};

export function Select({
  title,
  options,
  editable,
  value,
  onChange,
  ...props
}: SelectProps) {
  const [visible, openModal, closeModal] = useBoolean();
  const [search, setSearch] = useState('');
  const insets = useSafeArea();

  return (
    <>
      <TouchableWithoutFeedback
        disabled={editable === false}
        onPress={openModal}
      >
        <TextInput
          {...props}
          border="bottom"
          pointerEvents="none"
          editable={false}
          value={value}
          rightElement={editable === false ? undefined : chevronDown}
        />
      </TouchableWithoutFeedback>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.content}>
          <ModalHeader title={title} onClose={closeModal} />
          <View style={styles.search}>
            <Feather name="search" color={colors.textMuted} size={20} />
            <View style={styles.searchInput}>
              <TextInput
                border="none"
                placeholder="Search"
                returnKeyType="done"
                value={search}
                onChangeText={setSearch}
              />
            </View>
          </View>
          <FlatList<SelectValue>
            data={options.filter(({ label }) =>
              label.toLowerCase().startsWith(search.toLowerCase())
            )}
            bounces={false}
            keyExtractor={item => item.label}
            ItemSeparatorComponent={Divider}
            renderItem={({ item }) => (
              <Item
                label={item.label}
                selected={item.value === value}
                onPress={() => {
                  onChange && onChange(item.value);
                  closeModal();
                }}
              />
            )}
          />
          <View style={{ height: insets.bottom }} />
        </View>
      </Modal>
    </>
  );
}

const divider = {
  borderColor: colors.divider,
  borderBottomWidth: 1
};
const styles = StyleSheet.create({
  divider,
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  search: {
    ...divider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: containerPadding
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24
  },
  item: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: containerPadding
  },
  itemIcon: { marginTop: 5 }
});

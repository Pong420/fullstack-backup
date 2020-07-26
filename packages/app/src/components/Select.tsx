import React, { useState } from 'react';
import { Text, Modal, View, StyleSheet, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeArea } from 'react-native-safe-area-context';
import { TextInput } from './TextInput';
import { useBoolean } from '../hooks/useBoolean';
import { ModalHeader } from './Modal';
import {
  TouchableNativeFeedback,
  TouchableWithoutFeedback
} from 'react-native-gesture-handler';

export interface SelectValue {
  value: string;
  label: string;
}

export interface SelectProps {
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
  onChange
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
          border="bottom"
          editable={false}
          value={value}
          rightElement={chevronDown}
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
            <Feather name="search" color="#8a9ba8" size={20} />
            <View style={styles.searchInput}>
              <TextInput
                border="none"
                placeholder="Search"
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

const containerPadding = 24;
const borderColor = '#ddd';
const divider = {
  borderColor,
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

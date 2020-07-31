import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useLayoutEffect,
  ReactNode
} from 'react';
import {
  Animated,
  View,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
import { Subject } from 'rxjs';
import { useRxAsync } from 'use-rx-hooks';
import { SemiBold, Text } from './Text';
import { Button } from './Button';
import { shadow, containerPadding } from '@/styles';

export interface ConfirmModalProps {
  title?: ReactNode;
  content?: ReactNode;
  cancelText?: string;
  confirmText?: string;
  onConfirm: () => Promise<unknown>;
}

interface OnClose {
  onClose: () => void;
}

const subject = new Subject<ConfirmModalProps>();

export function createConfirmModalHandler(
  defaultProps?: Partial<ConfirmModalProps>
) {
  return function openConfirmModal(props: ConfirmModalProps) {
    return subject.next({ ...defaultProps, ...props });
  };
}

export const openConfirmModal = createConfirmModalHandler({
  cancelText: 'Cancel',
  confirmText: 'Confirm'
});

export function ConfirmModalContainer() {
  const [props, setProps] = useState<ConfirmModalProps>();
  const { onClose } = useMemo(
    () => ({
      onClose: () => setProps(undefined)
    }),
    []
  );

  useEffect(() => {
    const subscription = subject.subscribe(setProps);
    return () => subscription.unsubscribe();
  }, []);

  return props ? <ConfirmModal {...props} onClose={onClose} /> : null;
}

const duration = 300;
export function ConfirmModal({
  title,
  content,
  cancelText,
  confirmText,
  onConfirm,
  onClose
}: ConfirmModalProps & OnClose) {
  const anim = useRef(new Animated.Value(0));

  const { current: handleClose } = useRef(() =>
    Animated.timing(anim.current, {
      toValue: 0,
      duration,
      useNativeDriver: true
    }).start(() => onClose())
  );

  const { run, loading } = useRxAsync(onConfirm, {
    defer: true,
    onSuccess: handleClose
  });

  const closeModal = loading ? undefined : handleClose;

  useLayoutEffect(() => {
    Animated.timing(anim.current, {
      toValue: 1,
      duration,
      useNativeDriver: true
    }).start();
  }, []);

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <Animated.View
            style={{ ...styles.backdrop, opacity: anim.current }}
          />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            ...styles.modal,
            opacity: anim.current,
            transform: [
              {
                translateY: anim.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0]
                })
              }
            ]
          }}
        >
          <View style={styles.modalBody}>
            <SemiBold fontSize={20}>{title}</SemiBold>
            <View style={styles.modalContent}>
              <Text>{content}</Text>
            </View>
          </View>
          <View style={styles.footer}>
            <Button
              style={styles.button}
              ghost
              intent="DARK"
              title={cancelText}
              onPress={closeModal}
            />
            <Button
              intent="DARK"
              loading={loading}
              style={styles.button}
              title={confirmText}
              onPress={run}
            />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: containerPadding
  },
  modal: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
    marginBottom: 90,
    paddingTop: containerPadding * 0.75,
    paddingBottom: containerPadding,
    ...shadow(7)
  },
  modalBody: {
    paddingHorizontal: containerPadding
  },
  modalContent: {
    paddingVertical: 10
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: containerPadding / 2
  },
  button: {
    flex: 1,
    marginHorizontal: containerPadding / 2
  }
});

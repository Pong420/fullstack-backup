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
  ViewStyle,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
import { Subject } from 'rxjs';
import { SemiBold, Text } from './Text';
import { Button } from './Button';
import { shadow, containerPadding } from '@/styles';

export interface ConfirmModalProps {
  title?: ReactNode;
  content?: ReactNode;
  cancelText?: string;
  confirmText?: string;
  vertialFooter?: boolean;
  onConfirm?: () => void | Promise<unknown>;
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
  onClose,
  vertialFooter
}: ConfirmModalProps & OnClose) {
  const anim = useRef(new Animated.Value(0));
  const [loading, setLoading] = useState(false);

  const { current: handleClose } = useRef(() =>
    Animated.timing(anim.current, {
      toValue: 0,
      duration,
      useNativeDriver: true
    }).start(() => onClose())
  );

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
          <View
            style={vertialFooter ? styles.footerVertial : styles.footerHorzonal}
          >
            {!!cancelText && (
              <Button
                ghost
                intent="DARK"
                title={cancelText}
                onPress={closeModal}
                style={vertialFooter ? undefined : styles.buttonHorizonal}
              />
            )}
            {!!confirmText && (
              <Button
                intent="DARK"
                loading={loading}
                title={confirmText}
                style={
                  vertialFooter ? styles.buttonVertial : styles.buttonHorizonal
                }
                onPress={() => {
                  if (onConfirm) {
                    const promise = onConfirm();
                    if (promise instanceof Promise) {
                      promise
                        .then(() => {
                          setLoading(true);
                          handleClose();
                        })
                        .catch(() => setLoading(false));
                    } else {
                      handleClose();
                    }
                  }
                }}
              />
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const footer: ViewStyle = {
  marginTop: 20
};

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
  footerHorzonal: {
    ...footer,
    flexDirection: 'row',
    paddingHorizontal: containerPadding / 2
  },
  footerVertial: {
    ...footer,
    flexDirection: 'column-reverse',
    paddingHorizontal: containerPadding
  },
  buttonHorizonal: {
    flex: 1,
    marginHorizontal: containerPadding / 2
  },
  buttonVertial: {
    marginBottom: 10
  }
});

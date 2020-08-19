import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  useLayoutEffect
} from 'react';
import {
  Animated,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';
import { Subject } from 'rxjs';
import { Feather } from '@expo/vector-icons';
import { ApiError } from '@fullstack/typings';
import { getErrorMessage } from '@/service';
import { shadow, colors } from '@/styles';
import { Bold, TextWrap } from './Text';

interface Theme {
  color?: string;
  iconName?: string;
}

interface ToastItem extends Theme {
  key?: React.Key;
  title?: ReactNode;
  message: ReactNode;
}

interface ToastProps extends ToastItem {
  onClose: () => void;
}

const subject = new Subject<ToastItem>();

function createToster(defaultProps: Theme & Partial<ToastItem>) {
  return (props: ToastItem) =>
    subject.next({
      key: new Date().getTime() + Math.random(),
      ...defaultProps,
      ...props
    });
}

export const toaster = {
  success: createToster({
    color: colors.green,
    iconName: 'check',
    title: 'Success'
  }),
  info: createToster({
    color: colors.blue,
    iconName: 'info',
    title: 'Info'
  }),
  warn: createToster({
    color: colors.yellow,
    iconName: 'alert-octagon',
    title: 'Warning'
  }),
  error: createToster({
    color: colors.red,
    iconName: 'x-octagon',
    title: 'Error'
  }),
  apiError: (title = 'Error', error: ApiError) => {
    toaster.error({ title, message: getErrorMessage(error) });
  }
};

export function ToastContainer() {
  const [tosaters, setToasters] = useState<ToastItem[]>([]);

  useEffect(() => {
    const subscription = subject.subscribe(props => {
      setToasters(p => [props, ...p]);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <SafeAreaView
      style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
    >
      {tosaters.map(({ key, ...props }, idx) => (
        <Toast
          {...props}
          key={key}
          onClose={() => setToasters(t => t.filter(t => t.key !== key))}
        />
      ))}
    </SafeAreaView>
  );
}

const iconSize = 20;

export function Toast({
  onClose,
  color,
  iconName,
  title,
  message
}: ToastProps) {
  const trans = useRef(new Animated.Value(0));
  const closeAnim = useRef(new Animated.Value(1));
  const close = useRef(() =>
    Animated.timing(closeAnim.current, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(() => onClose())
  );

  useLayoutEffect(() => {
    Animated.spring(trans.current, {
      toValue: 1,
      useNativeDriver: true
    }).start();

    const timeout = setTimeout(close.current, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: closeAnim.current,
        transform: [
          {
            translateY: trans.current.interpolate({
              inputRange: [0, 1],
              outputRange: [-100, 0]
            })
          }
        ]
      }}
    >
      <TouchableWithoutFeedback onPress={close.current}>
        <View style={styles.container}>
          <View style={{ ...styles.indicator, backgroundColor: color }} />
          <View style={styles.body}>
            <Feather
              name={iconName || ''}
              color={color}
              size={iconSize}
              style={styles.icon}
            />
            <View style={styles.content}>
              <Bold fontSize={16}>{title}</Bold>
              <TextWrap>{message}</TextWrap>
            </View>

            <Feather
              name="x"
              color={colors.black}
              size={iconSize}
              style={styles.closeIcon}
              onPress={onClose}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    ...shadow(2)
  },
  indicator: {
    width: 5,
    height: '100%'
  },
  body: {
    padding: 15,
    flexGrow: 1,
    flexDirection: 'row'
  },
  icon: { marginTop: 3 },
  content: { flexGrow: 1, paddingHorizontal: 10 },
  closeIcon: { alignSelf: 'center' },
  flexRow: { flexDirection: 'row' },
  wrapTextStyle: { flex: 1, flexWrap: 'wrap' }
});

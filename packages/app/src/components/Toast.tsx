import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  useLayoutEffect
} from 'react';
import { Animated, View, SafeAreaView } from 'react-native';
import { Subject } from 'rxjs';
import { Feather } from '@expo/vector-icons';
import { Bold, Text } from './Text';
import { ApiError } from '@fullstack/typings';
import { getErrorMessage } from '@fullstack/common/service';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

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
    color: '#0F9960',
    iconName: 'check',
    title: 'Success'
  }),
  info: createToster({
    color: '#2965CC',
    iconName: 'info',
    title: 'Info'
  }),
  warn: createToster({
    color: '#D9822B',
    iconName: 'alert-octagon',
    title: 'Warning'
  }),
  error: createToster({
    color: '#DB3737',
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
      <TouchableWithoutFeedback
        onPress={close.current}
        style={{
          marginHorizontal: 20,
          marginVertical: 5,
          backgroundColor: '#fff',
          flexDirection: 'row',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1
          },
          shadowOpacity: 0.5,
          shadowRadius: 1,
          elevation: 1
        }}
      >
        <View
          style={{
            width: 5,
            height: '100%',
            backgroundColor: color
          }}
        />
        <View
          style={{
            padding: 15,
            flexGrow: 1,
            flexDirection: 'row'
          }}
        >
          <Feather
            name={iconName || ''}
            color={color}
            size={iconSize}
            style={{ marginTop: 3 }}
          />
          <View style={{ flexGrow: 1, paddingHorizontal: 10 }}>
            <Bold fontSize={16}>{title}</Bold>
            <View style={{ flexDirection: 'row' }}>
              <Text fontSize={14} style={{ flex: 1, flexWrap: 'wrap' }}>
                {message}
              </Text>
            </View>
          </View>
          <Feather
            name="x"
            color="#182026"
            size={iconSize}
            style={{ alignSelf: 'center' }}
            onPress={onClose}
          />
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

import { useEffect } from 'react';
import { Keyboard } from 'react-native';
import { useState } from 'react';

export function useKeyboard() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const _keyboardDidShow = () => {
      setVisible(true);
    };

    const _keyboardDidHide = () => {
      setVisible(false);
    };

    const show = 'keyboardWillShow';
    const hide = 'keyboardWillHide';

    Keyboard.addListener(show, _keyboardDidShow);
    Keyboard.addListener(hide, _keyboardDidHide);

    return () => {
      Keyboard.removeListener(show, _keyboardDidShow);
      Keyboard.removeListener(hide, _keyboardDidHide);
    };
  }, []);

  return visible;
}

declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare interface Window {
  __REDUX_DEVTOOLS_EXTENSION__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
}

// https://codesandbox.io/s/github/piotrwitek/typesafe-actions-todo-app
declare interface NodeModule {
  hot?: { accept: (path?: string, callback?: () => void) => void };
}

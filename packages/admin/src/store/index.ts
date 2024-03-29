import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createEpicMiddleware, Epic } from 'redux-observable';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { createBrowserHistory } from 'history';
import rootEpic from './epics';
import createRootReducer from './reducers';

export const history = createBrowserHistory({ basename: '/admin' });

const epic$ = new BehaviorSubject(rootEpic);
const hotReloadingEpic: Epic = (...args) =>
  epic$.pipe(switchMap(epic => epic(...args)));

export default function configureStore() {
  const epicMiddleware = createEpicMiddleware();
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composeEnhancers(
    applyMiddleware(routerMiddleware(history), epicMiddleware)
  );

  const store = createStore(createRootReducer(history), undefined, enhancer);

  epicMiddleware.run(hotReloadingEpic);

  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('./reducers', () => {
        store.replaceReducer(createRootReducer(history));
      });

      module.hot.accept('./epics', () => {
        const nextRootEpic = require('./epics').default;
        epic$.next(nextRootEpic);
      });
    }
  }

  return store;
}

export * from './actions';
export * from './reducers';
export * from './epics';
export * from './selectors';

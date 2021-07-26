# async-reducer-context

在react-context,useReducer基础上提供异步能力，可以支持saga，thunk等，具体见demo。

[demo](https://codesandbox.io/s/gallant-smoke-zmp0u?file=/src/component/title.js)


createProvider.js
```
import createSagaMiddleware from 'redux-saga';
import reduxThunk from 'redux-thunk';
import createRoot, { applyMiddleware } from 'async-reducer-context/src';

import rootSaga from '../store/sagas/hello';

const sagaMiddleware = createSagaMiddleware();
const RootContext = createRoot({
  INCREMENT: (states: any, payload: any) => ({ ...states, title: payload.title }),
}, applyMiddleware(reduxThunk, sagaMiddleware));

RootContext.ready(() => sagaMiddleware.run(rootSaga));

export default RootContext;
```

app.js
```
function App() {
  const menus = [
  {
    label: '推荐',
    key: 'menu-1',
  },
  {
    label: '歌手',
    key: 'menu-2',
  },
  {
    label: '排行榜',
    key: 'menu-3',
  },
  ];
  return (
    <RootContext.Provider value={{ title: '云音悦', menus }}>
      {children}
    </RootContext.Provider>
  )
}
```

child.js
```
import React, { useEffect } from 'react';

import RootContext from '../../../context/util';
import styles from './index.scss';

export default function Title() {
  const [title, dispatch] = RootContext.useModel(['title']);
  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: 'INCREMENT_ASYNC', payload: { title: '云音悦s' } });
    }, 2000);
  }, []);
  console.log('title component', title);
  return (
    <div className={styles.title}>
      <Icon type="anticon-chanpinguanli1" className={styles.link} onClick={linkHome} />
      <span className={styles.font}>{title}</span>
      <Icon type="anticon-sousuo" className={styles.link} onClick={linkSearch} />
    </div>
  );
}

```

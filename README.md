# async-reducer-context
通过react-context,useReducer替代redux，可扩展支持与redux周边middleware中间件，通过useModel(['key'])可获取state和dispatch，其中useModel已做到获取的属性值变化，组件才会重新渲染，摆脱useContext因context中无关数据导致的重复渲染问题。

[点击codesandbox](https://codesandbox.io/s/gallant-smoke-zmp0u?file=/src/index.js)


createProvider.js
```
import createSagaMiddleware from 'redux-saga';
import reduxThunk from 'redux-thunk';
import createRoot, { applyMiddleware } from 'async-reducer-context/src';

import rootSaga from '../store/sagas/hello';

//  这里的key其实就是userReducer(reducer)函数中的action.type。
const reducers = {
  INCREMENT: (states: any, payload: any) => ({ ...states, title: payload.title }),
}

const sagaMiddleware = createSagaMiddleware();
const RootContext = createRoot(reducers, applyMiddleware(reduxThunk, sagaMiddleware));

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

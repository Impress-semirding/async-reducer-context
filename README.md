# async-reducer-context
1.这是context和useReducer状态管理方案，解决了useContext频繁渲染问题。

2.async-reducer-context可扩展支持redux的middleware中间件，让适应redux的同学也可以很好通过context，userReducer书写代码，是否使用决定权在于你。

与其他useContext库对比，优点在于可以支持异步任务。

[点击codesandbox](https://codesandbox.io/s/gallant-smoke-zmp0u?file=/src/index.js)


createProvider.js
```
import createSagaMiddleware from 'redux-saga';
import reduxThunk from 'redux-thunk';
import createRoot, { applyMiddleware } from 'async-reducer-context';

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


如下是直接context和useReducer组合，但是dispatch没有异步能力。
createProvider.js
```
import createRoot from 'async-reducer-context';

//  这里的key其实就是userReducer(reducer)函数中的action.type。
const reducers = {
  INCREMENT: (states: any, payload: any) => ({ ...states, title: payload.title }),
}

const RootContext = createRoot(reducers);

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
组件可通过RootContext.useModel(['title'])获取对应state中title属性，这里其实是lodash.get(context.state, "[title]")，后续会持续改造优化.
```
import React, { useEffect } from 'react';

import RootContext from '../../../context';
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

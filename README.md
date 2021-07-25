# react-hook-async

a.js
```
import createSagaMiddleware from 'redux-saga';
import reduxThunk from 'redux-thunk';
import createRoot, { applyMiddleware } from 'react-hook-middleware';

import helloSaga from './sagas/hello';

const initState = { title: 'test' };

const sagaMiddleware = createSagaMiddleware();

const contextRoot = createRoot({
  alter: (states: any, payload: any) => ({ ...states, title: payload.title }),
}, initState, applyMiddleware(reduxThunk, sagaMiddleware));

contextRoot.ready(() => sagaMiddleware.run(helloSaga));

export default contextRoot;

```

b.js
```
import React, { useEffect, useCallback } from 'react';

import contextRoot from './a';

interface IProps {
  title: string,
}

export default function Title({ title }: IProps) {
  const { state, dispatch } = React.useContext(contextRoot.context);

  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: 'alter-effect', payload: { title: 'test2' } });
    }, 2000);
  }, []);
  console.log('title component', state);
  return (
    <div className={styles.title}>
      <span className={styles.font}>{state.title}</span>
    </div>
  );
}

```

hello.js
```
import { put, takeEvery, delay } from 'redux-saga/effects';

export function* incrementAsync() {
  yield delay(1000);
  yield put({ type: 'alter' });
}

export default function* rootSaga() {
  yield takeEvery('alter-effect', incrementAsync);
}

```


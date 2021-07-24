# react-saga-hook

```
const storeContext = createStore({
  INCREMENT: (states, payload) => ({ ...states, title: payload.title }),
}, helloSaga, initState);

//  storeContext = { RootContext, Provider };
export default storeContext;
```
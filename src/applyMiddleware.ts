import {
  IAction, IStore, Dispatch, Middleware,
} from './types';

export default function applyMiddleware(...middlewares: Middleware[]) {
  return (store: IStore) => {
    // eslint-disable-next-line no-unused-vars
    let dispatch: Dispatch = (action, ...args) => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. '
        + 'Other middleware would not be applied to this dispatch.',
      );
    };

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action: IAction, ...args: any) => dispatch(action, ...args),
    };
    const chain = middlewares.map((middleware: any) => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);
    return dispatch;
  };
}

function compose(...funcs: Function[]) {
  if (funcs.length === 0) {
    // infer the argument type so it is usable in inference down the line
    return <T>(arg: T) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(
    (a, b) => (...args: any) => a(b(...args)),
  );
}

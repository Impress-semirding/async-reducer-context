export default function applyMiddleware(...middlewares: any) {
  return (store: any) => {
    // eslint-disable-next-line no-unused-vars
    let dispatch = (action: any, ...args: any) => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. '
        + 'Other middleware would not be applied to this dispatch.',
      );
    };

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action: any, ...args: any) => dispatch(action, ...args),
    };
    const chain = middlewares.map((middleware: any) => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch,
    };
  };
}

function compose(...funcs: any) {
  if (funcs.length === 0) {
    // infer the argument type so it is usable in inference down the line
    return (arg: any) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(
    (a: any, b: any) => (...args: any) => a(b(...args)),
  );
}

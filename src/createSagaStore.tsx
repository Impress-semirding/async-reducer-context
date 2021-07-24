import React, { createContext, useCallback, useEffect } from 'react';
import createSagaMiddleware from 'redux-saga';
import applyMiddleware from './applyMiddleware';
import IState, { IAction, IActionMap } from './types';

const { useReducer } = React;

function createReducer(initState: IState = {}, actionMap?: IActionMap) {
  let handles: IActionMap = {};
  //  fix for reducer hook one params.
  if (!actionMap) {
    handles = initState;
  } else {
    handles = actionMap;
  }
  return (state: IState = initState, action: IAction) => {
    const { type } = action;
    if (handles[type]) {
      return handles[type](state, action.payload);
    }

    return state;
  };
}

export default function createStore(reducers: IActionMap, rootSaga: any, initState: IState) {
  const reducer = createReducer(initState, reducers);
  const RootContext = createContext(initState);
  const sagaMiddleware = createSagaMiddleware();
  const enhancer = applyMiddleware(sagaMiddleware);

  const Provider = ({ children }: { children: React.ReactChildren }) => {
    const [state, dispatch] = useReducer(reducer, initState);
    const getState = useCallback(() => state, [state]);
    const log = (action: IAction) => {
      // if (window.location.href.includes('debug=true')) {
      //   console.log(action);
      // }
      dispatch(action);
    };

    const { dispatch: enhanceDispatch } = enhancer({ getState, dispatch: log });

    useEffect(() => {
      sagaMiddleware.run(rootSaga);
    }, []);

    return (
      <RootContext.Provider value={{ state, dispatch: enhanceDispatch }}>
        {children}
      </RootContext.Provider>
    );
  };

  return {
    RootContext,
    Provider,
  };
}

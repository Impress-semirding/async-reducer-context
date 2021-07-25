import React, { createContext, useCallback, useEffect } from 'react';
import EventEmitter from './event';
import IState, { IAction, IActionMap } from './types';

const { useReducer } = React;

function createReducer(initState: any = {}, actionMap?: IActionMap) {
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

export default function createRoot(
  reducers: IActionMap, initState: IState, enhancer: any,
) {
  const reducer = createReducer(initState, reducers);
  const context = createContext(initState);
  const event = new EventEmitter();

  const ready = (callback: any) => {
    event.on(callback);
  };

  const Provider = ({ children }: any) => {
    const [state, dispatch] = useReducer(reducer, initState);
    const getState = useCallback(() => state, [state]);
    const log = (action: any) => {
      if (window.location.href.includes('debug=true')) {
        console.log(action);
      }
      dispatch(action);
    };

    const { dispatch: enhanceDispatch } = enhancer({ getState, dispatch: log });

    useEffect(() => {
      event.run();
    }, []);

    return (
      <context.Provider value={{ state, dispatch: enhanceDispatch }}>
        {children}
      </context.Provider>
    );
  };

  return {
    context,
    Provider,
    ready,
  };
}

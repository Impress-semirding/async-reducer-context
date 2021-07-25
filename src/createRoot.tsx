import React from 'react';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import EventEmitter from './event';
import Subs from './sub';
import IState, { IAction, IActionMap } from './types';

console.log(React);

// eslint-disable-next-line no-unused-vars
type IReducer = (state: IState, action: IAction) => IState;

const {
  createContext, useState, useCallback, useEffect, useMemo, useReducer, useRef, useContext,
} = React;

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
  reducers: IActionMap, enhancer: any,
) {
  const context = createContext({});
  const subContext: any = createContext({});
  const reducer = createReducer(reducers);
  const event = new EventEmitter();

  const ready = (callback: any) => {
    event.on(callback);
  };

  const userStore: any = () => useContext(context);

  const useModel = (deps: string[] = []) => {
    const memorizeDeps = useMemo(() => deps, []);

    if (!memorizeDeps.length) {
      return useContext(context);
    }
    const container: any = useContext(subContext);
    const { state: value, subs } = container;
    const [state, setState] = useState(get(value, memorizeDeps));
    const prevDepsRef = useRef(state);
    useEffect(() => {
      const observer = () => {
        const prev: any = prevDepsRef.current;
        const curr = get(container.state, memorizeDeps);
        if (!isEqual(prev, curr)) {
          setState(state);
        }
        prev.current = curr;
      };
      subs.add(observer);
      return () => {
        subs.delete(observer);
      };
    }, []);

    return state;
  };

  const Provider = ({ value, children }: any) => {
    const [state, dispatch] = useReducer(reducer, value);
    const ref = useRef({ state: value, subs: new Subs(state) });

    useEffect(() => {
      ref.current.state = state;
      ref.current.subs.notify();
    });

    const getState = () => state;
    const log = useCallback((action: any) => {
      if (window.location.href.includes('debug=true')) {
        console.log(action);
      }
      dispatch(action);
    }, []);

    const { dispatch: enhanceDispatch } = enhancer({ getState, dispatch: log });

    useEffect(() => {
      event.run();
    }, []);

    return (
      <context.Provider value={{ state, dispatch: enhanceDispatch }}>
        <subContext.Provider value={ref.current}>
          {children}
        </subContext.Provider>
      </context.Provider>
    );
  };

  return {
    context,
    Provider,
    useModel,
    userStore,
    ready,
  };
}

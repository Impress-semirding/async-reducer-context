import React from 'react';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';

import Subs from './sub';
import IState, {
  IAction, IActionMap, IProvider,
} from './types';

// eslint-disable-next-line no-unused-vars
type IReducer = (state: IState, action: IAction) => IState;

const {
  createContext, useState, useEffect, useMemo, useReducer, useRef, useContext,
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

//  provide getState for middleware.
class Store {
  state: any;

  getState() {
    return this.state;
  }

  set(value: any) {
    this.state = value;
  }
}

export default function createRoot(
  reducers: IActionMap, enhancer: any,
) {
  const context = createContext({});
  const subContext = createContext({});
  const reducer = createReducer(reducers);
  const middlewareSub = new Subs();
  const store = new Store();
  let enhanceDispatch: Function;

  const ready = (callback: Function) => {
    middlewareSub.add(callback);
  };

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
          setState(curr);
        }
        prevDepsRef.current = curr;
      };
      subs.add(observer);
      return () => {
        subs.delete(observer);
      };
    }, []);

    return [state, container.dispatch];
  };

  const reducerProxy = (s: IState, payload: IAction) => {
    const n = reducer(s, payload);
    store.set(n);
    return n;
  };

  const Provider = ({ value, children }: IProvider) => {
    const [
      state, dispatch,
    ] = useReducer(reducerProxy, value);

    if (enhancer && typeof enhancer === 'function') {
      enhanceDispatch = enhanceDispatch || enhancer({ getState: store.getState, dispatch });
    } else {
      enhanceDispatch = dispatch;
    }

    const ref: any = useRef({ state: value, subs: new Subs(), dispatch: enhanceDispatch });

    useEffect(() => {
      ref.current.state = state;
      ref.current.dispatch = enhanceDispatch;
      ref.current.subs.notify();
    });

    //  异步调用middleware，特别为run(rootSaga)提供
    useEffect(() => {
      middlewareSub.notify();
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
    Provider,
    useModel,
    ready,
  };
}

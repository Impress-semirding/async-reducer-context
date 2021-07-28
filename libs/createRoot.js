import React from 'react';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import Subs from './sub';
var createContext = React.createContext, useState = React.useState, useEffect = React.useEffect, useMemo = React.useMemo, useReducer = React.useReducer, useRef = React.useRef, useContext = React.useContext;
function createReducer(initState, actionMap) {
    if (initState === void 0) { initState = {}; }
    var handles = {};
    //  fix for reducer hook one params.
    if (!actionMap) {
        handles = initState;
    }
    else {
        handles = actionMap;
    }
    return function (state, action) {
        if (state === void 0) { state = initState; }
        var type = action.type;
        if (handles[type]) {
            return handles[type](state, action.payload);
        }
        return state;
    };
}
//  provide getState for middleware.
var Store = /** @class */ (function () {
    function Store() {
    }
    Store.prototype.getState = function () {
        return this.state;
    };
    Store.prototype.set = function (value) {
        this.state = value;
    };
    return Store;
}());
export default function createRoot(reducers, enhancer) {
    var context = createContext({});
    var subContext = createContext({});
    var reducer = createReducer(reducers);
    var middlewareSub = new Subs();
    var store = new Store();
    var enhanceDispatch;
    var ready = function (callback) {
        middlewareSub.add(callback);
    };
    var useModel = function (deps) {
        if (deps === void 0) { deps = []; }
        var memorizeDeps = useMemo(function () { return deps; }, []);
        if (!memorizeDeps.length) {
            return useContext(context);
        }
        var container = useContext(subContext);
        var value = container.state, subs = container.subs;
        var _a = useState(get(value, memorizeDeps)), state = _a[0], setState = _a[1];
        var prevDepsRef = useRef(state);
        useEffect(function () {
            var observer = function () {
                var prev = prevDepsRef.current;
                var curr = get(container.state, memorizeDeps);
                if (!isEqual(prev, curr)) {
                    setState(curr);
                }
                prevDepsRef.current = curr;
            };
            subs.add(observer);
            return function () {
                subs.delete(observer);
            };
        }, []);
        return [state, container.dispatch];
    };
    var reducerProxy = function (s, payload) {
        var n = reducer(s, payload);
        store.set(n);
        return n;
    };
    var Provider = function (_a) {
        var value = _a.value, children = _a.children;
        var _b = useReducer(reducerProxy, value), state = _b[0], dispatch = _b[1];
        if (enhancer && typeof enhancer === 'function') {
            enhanceDispatch = enhanceDispatch || enhancer({ getState: store.getState, dispatch: dispatch });
        }
        else {
            enhanceDispatch = dispatch;
        }
        var ref = useRef({ state: value, subs: new Subs(), dispatch: enhanceDispatch });
        useEffect(function () {
            ref.current.state = state;
            ref.current.dispatch = enhanceDispatch;
            ref.current.subs.notify();
        });
        //  异步调用middleware，特别为run(rootSaga)提供
        useEffect(function () {
            middlewareSub.notify();
        }, []);
        return (React.createElement(context.Provider, { value: { state: state, dispatch: enhanceDispatch } },
            React.createElement(subContext.Provider, { value: ref.current }, children)));
    };
    return {
        Provider: Provider,
        useModel: useModel,
        ready: ready,
    };
}

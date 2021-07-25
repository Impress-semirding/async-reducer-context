import React, { createContext, useCallback, useEffect } from 'react';
import EventEmitter from './event';
var useReducer = React.useReducer;
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
export default function createRoot(reducers, initState, enhancer) {
    var reducer = createReducer(initState, reducers);
    var context = createContext(initState);
    var event = new EventEmitter();
    var ready = function (callback) {
        event.on(callback);
    };
    var Provider = function (_a) {
        var children = _a.children;
        var _b = useReducer(reducer, initState), state = _b[0], dispatch = _b[1];
        var getState = useCallback(function () { return state; }, [state]);
        var log = function (action) {
            if (window.location.href.includes('debug=true')) {
                console.log(action);
            }
            dispatch(action);
        };
        var enhanceDispatch = enhancer({ getState: getState, dispatch: log }).dispatch;
        useEffect(function () {
            event.run();
        }, []);
        return (React.createElement(context.Provider, { value: { state: state, dispatch: enhanceDispatch } }, children));
    };
    return {
        context: context,
        Provider: Provider,
        ready: ready,
    };
}

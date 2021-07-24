import React, { createContext, useCallback, useEffect } from 'react';
import createSagaMiddleware from 'redux-saga';
import applyMiddleware from './applyMiddleware';
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
export default function createStore(reducers, rootSaga, initState) {
    var reducer = createReducer(initState, reducers);
    var RootContext = createContext(initState);
    var sagaMiddleware = createSagaMiddleware();
    var enhancer = applyMiddleware(sagaMiddleware);
    var Provider = function (_a) {
        var children = _a.children;
        var _b = useReducer(reducer, initState), state = _b[0], dispatch = _b[1];
        var getState = useCallback(function () { return state; }, [state]);
        var log = function (action) {
            // if (window.location.href.includes('debug=true')) {
            //   console.log(action);
            // }
            dispatch(action);
        };
        var enhanceDispatch = enhancer({ getState: getState, dispatch: log }).dispatch;
        useEffect(function () {
            sagaMiddleware.run(rootSaga);
        }, []);
        return (React.createElement(RootContext.Provider, { value: { state: state, dispatch: enhanceDispatch } }, children));
    };
    return {
        RootContext: RootContext,
        Provider: Provider,
    };
}

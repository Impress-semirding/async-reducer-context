import { Statement } from "@babel/types";
import React from "react";


interface IActionMap {
  // eslint-disable-next-line no-unused-vars
  [key: string]: (state: IState, payload: Ipayload) => IState,
}

interface IAction {
  type: string,
  payload: Ipayload
}

interface Ipayload {
  [key: string]: string,
}
interface IState {
  [key: string]: any,
}

interface Action<T = any> {
  type: T
}

interface AnyAction extends Action {
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any
}

interface Dispatch<A extends Action = AnyAction> {
  <T extends A>(action: T, ...extraArgs: any[]): T
}

interface MiddlewareAPI<D extends Dispatch = Dispatch, S = any> {
  dispatch: D
  getState(): S
}

interface Middleware<
  _DispatchExt = {}, // TODO: remove unused component (breaking change)
  S = any,
  D extends Dispatch = Dispatch
> {
  (api: MiddlewareAPI<D, S>): (
    next: D
  ) => (action: D extends Dispatch<infer A> ? A : never) => any
}

interface IStore {
  getState: (state : any) => any,
  dispatch: Dispatch
}

interface IProvider {
  value: any, 
  children: React.ReactChild
}

export {
  IAction,
  IActionMap,
  Ipayload,
  Dispatch,
  Middleware,
  IStore,
  IProvider
};

export default IState;

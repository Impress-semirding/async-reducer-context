interface Ipayload {
  [key: string]: string,
}

interface IAction {
  type: string,
  payload: Ipayload
}

interface IActionMap {
  // eslint-disable-next-line no-unused-vars
  [key: string]: (state: IState, payload: Ipayload) => IState,
}

interface IState {
  [key: string]: any,
}

export {
  IAction,
  IActionMap,
  Ipayload,
};

export default IState;

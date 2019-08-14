import { AnyAction } from "redux";
import { EffectsCommandMap } from "dva";
import { MenuDataItem } from "@ant-design/pro-layout";
import { RouterTypes } from "umi";
import { DefaultSettings as SettingModelState } from "../../config/defaultSettings";
import { UserModelState } from "./account";

export { SettingModelState, UserModelState };

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    account?: boolean;
  };
}

export interface ConnectState {
  loading: Loading;
  settings: SettingModelState;
  account: UserModelState;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & {
    select: <T>(func: (state: ConnectState) => T) => T;
  }
) => void;

/**
 * @type P: Type of payload
 * @type C: Type of callback
 */
export type Dispatch = <P = any, C = (payload: P) => void>(action: {
  type: string;
  payload?: P;
  callback?: C;
  [key: string]: any;
}) => any;

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch;
}

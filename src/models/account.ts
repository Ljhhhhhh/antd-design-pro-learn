import { AnyAction, Reducer } from "redux";
import { parse, stringify } from "qs";
import { fakeAccountLogin } from "@/services/account";
import { EffectsCommandMap } from "dva";
import { routerRedux } from "dva/router";
import { changeUserinfo } from "@/utils/utils";

export function getPageQuery(): {
  [key: string]: string;
} {
  return parse(window.location.href.split("?")[1]);
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T }
) => void;

export interface UserModelState {
  [key: string]: string | number;
}

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    logout: Effect;
    login: Effect;
    setUserinfo: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<{}>;
  };
}

const Model: ModelType = {
  namespace: "account",

  state: {
    status: undefined
  },

  effects: {
    *logout(_, { put }) {
      const { redirect } = getPageQuery();
      localStorage.clear();
      yield put({
        type: "changeLoginStatus",
        payload: {}
      });
      // redirect
      if (window.location.pathname !== "/account/login" && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: "/account/login",
            search: stringify({
              redirect: window.location.href
            })
          })
        );
      }
    },
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      // Login successfully
      if (response.status === 0) {
        const userinfo = {
          ...response.data,
          isAdmin: payload.isAdmin
        }
        changeUserinfo(userinfo)
        yield put({
          type: "changeLoginStatus",
          payload: response.data
        });
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf("#") + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        window.location.href = redirect || "/"
        // yield put(routerRedux.replace(redirect || "/")); // 存在路由不刷新的bug
      }
    },
    *setUserinfo({}, { call, put }) {
      let userinfo = localStorage.getItem("userinfo") ? JSON.parse(localStorage.getItem("userinfo") || '') : null
      if (userinfo) {
        changeUserinfo(userinfo);
        yield put({
          type: "changeLoginStatus",
          payload: userinfo
        });
      } else {
        yield put(routerRedux.replace("/account/login"));
      }
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...payload
      };
    }
  }
};

export default Model;

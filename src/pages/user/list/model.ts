import { AnyAction, Reducer } from "redux";
import { fetchUser } from "@/services/user";
import { EffectsCommandMap } from "dva";

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T }
) => void;

export interface UserModelState {
  [key: string]: string | number;
}

export interface UserState {
  userList: any[],
  loading: boolean,
  pagination: {
    current: number,
    total: number
  }
}

export interface ModelType {
  namespace: string;
  state: UserState;
  effects: {
    getUserList: Effect;
  };
  reducers: {
    setUserList: Reducer<{}>;
    setLoading: Reducer<{}>;
  };
}

const Model: ModelType = {
  namespace: "user",

  state: {
    userList: [],
    loading: false,
    pagination: {
      current: 1,
      total: 0
    }
    
  },

  effects: {
    *getUserList({ payload }, { call, put }) {
      yield put({type: "setLoading"});
      let data = payload
      if (!data) {
        data = {
          current: 1,
          pageSize: 10
        }
      }
      const response = yield call(fetchUser, data)
      if (response.status === 0) {
        yield put({
          type: "setUserList",
          payload: response.data
        });
      }
    }
  },

  reducers: {
    setUserList(state, { payload }) {
      const { list, prePage, total } = payload;
      return {
        loading: false,
        userList: list,
        pagination: {
          current: prePage + 1,
          total
        }
      };
    },
    setLoading(state) {
      return {
        ...state,
        loading: true
      }
    }
  }
};

export default Model;

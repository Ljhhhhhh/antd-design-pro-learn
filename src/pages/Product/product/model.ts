// import { pagination } from './model';
import { AnyAction, Reducer } from "redux";
import { fetchProduct, setProductStatus, createProduct } from "@/services/product";
import { EffectsCommandMap } from "dva";
import { message } from 'antd'
import {routerRedux} from 'dva/router'

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T }
) => void;

export interface UserModelState {
  [key: string]: string | number;
}

export interface paginationProps {
  pageNum: number;
  total: number
}

export interface ProductStateProps {
  list: any[],
  pagination: paginationProps;
  // loading: boolean
}

export interface ModelType {
  namespace: string;
  state: ProductStateProps;
  effects: {
    getList: Effect;
    setStatus: Effect;
    create: Effect;
    // setCategoryName: Effect;
    // createCategory: Effect;
  };
  reducers: {
    setList: Reducer<{}>;
    changeStatus: Reducer<{}>;
  };
}

const Model: ModelType = {
  namespace: "product",

  state: {
    list: [],
    pagination: {
      pageNum: 1,
      total: 0
    }
    // loading: false
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(fetchProduct, payload)
      if (response.status === 0) {
        yield put({
          type: "setList",
          payload: response.data
        });
      }
    },

    *setStatus({payload}, {call, put, select}) {
      const response = yield call(setProductStatus, payload)
      if (response.status === 0) {
        message.success(response.data || '修改产品状态成功')
        const state = yield select(state => state)

        // 不需要重新请求列表，直接修改本地列表数据 Immutable.js提高效率?
        const newList = state.product.list.map((item: any) => {
          if (item.id === payload.productId) {
            item.status = payload.status
            return item
          }
          return item
        })
        yield put({
          type: 'changeStatus',
          payload: newList
        })

        // 如果需要重新请求列表获取新状态
        // yield put({
        //   type: 'getList',
        //   payload: {
        //     pageNum: state.product.pagination.pageNum
        //   }
        // })
      } else {
        message.error(response.data || '修改产品状态失败')
      }
    },

    *create({ payload}, { call, put }) {
      const response = yield call(createProduct, payload)
      if (response.status === 0) {
        message.success(response.data || '新建产品成功')
        yield put(routerRedux.push('/product/product'))
      } else {
        message.error(response.data || '新建产品失败')
      }
    }
  },

  reducers: {
    setList(state, { payload }) {
      return {
        list: payload.list,
        pagination: {
          pageNum: payload.pageNum,
          total: payload.total
        }
      };
    },
    changeStatus(state, { payload }) {
      return {
        ...state,
        list: payload
      }
    }
  }
};

export default Model;

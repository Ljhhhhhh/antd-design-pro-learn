/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = (path: string): boolean => reg.test(path);

const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === "site") {
    return true;
  }
  return window.location.hostname === "preview.pro.ant.design";
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === "development") {
    return true;
  }
  return isAntDesignPro();
};

export function setAuthority(authority: string | string[]) {
  const proAuthority = typeof authority === "string" ? [authority] : authority;
  return localStorage.setItem(
    "antd-pro-authority",
    JSON.stringify(proAuthority)
  );
}

interface userinfoParams {
  answer: string
  createTime: number
  email: string
  id: number
  password: string
  phone: string
  question: string
  role: number
  updateTime: number
  username: string
  isAdmin?: boolean
}

export function changeUserinfo(userinfo: userinfoParams) {
  localStorage.setItem('userinfo', JSON.stringify(userinfo));
  const authority = userinfo.isAdmin ? 'admin' : 'user';
  setAuthority(authority)
}

export { isAntDesignProOrDev, isAntDesignPro, isUrl };

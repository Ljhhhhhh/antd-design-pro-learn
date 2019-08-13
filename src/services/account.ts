import request from "@/utils/request";
export interface FormDataType {
  userName: string;
  password: string;
}

export function fakeAccountLogin(params: FormDataType) {
  return request("/manage/user/login.do", {
    method: "POST",
    data: params
  });
}
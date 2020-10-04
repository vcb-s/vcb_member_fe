import axios, { Method, AxiosResponse, AxiosPromise } from 'axios';

import { token } from './token';
import { PaginationParam } from './types/Pagination';
import { ResponseData } from './types/ResponseData';
import { UserCard } from './types/UserCard';
import { Group } from './types/Group';

const axiosInstance = axios.create({
  baseURL: '/vcbs_member_api',
  withCredentials: false,
});

axiosInstance.interceptors.request.use((config) => {
  config.headers['X-Token'] = token.token;
  config.headers['X-RefreshToken'] = token.refreshToken;

  return config;
});

axiosInstance.interceptors.response.use((reponse) => {
  if ('token' in reponse.headers) {
    token.token = reponse.headers['token'];
  }
  if ('refreshToken' in reponse.headers) {
    token.refreshToken = reponse.headers['refreshToken'];
  }

  return reponse;
});

interface FetchParam {
  url: string;
  method?: Method;
  data?: any;
}
export const ajax = (param: FetchParam) => {
  const { url, method = 'GET', data } = param;
  switch (method.toUpperCase()) {
    case 'GET': {
      return axiosInstance({ url, params: data, method });
    }
    case 'POST': {
      return axiosInstance({ url, data, method });
    }
    default: {
      return axiosInstance({ url, params: data, method: 'GET' });
    }
  }
};

namespace request {
  export namespace userCard {
    export interface ReadParam extends Partial<PaginationParam> {
      group?: Group.Item['id'];
      retired?: UserCard.Item['retired'];
      IDS?: UserCard.Item['id'][];
    }
    export interface ReadResponse
      extends ResponseData.OK<{
        res: UserCard.ItemInResponse[];
        total: number;
      }> {}
    export const url = '/user-card/list';
    export const read = (data: ReadParam): Promise<ReadResponse> => {
      return ajax({
        url,
        data: data,
      });
    };
  }
  export namespace group {
    export const url = '/group/list';
    export interface ReadResponse
      extends ResponseData.OK<{
        res: Group.ItemInResponse[];
        total: number;
      }> {}
    export const read = (): Promise<ReadResponse> => {
      return ajax({ url });
    };
  }
}

export const strictCheck = <
  D extends ResponseData.DataContent,
  T extends ResponseData.OK<D>
>(
  response: T,
): T => {
  if (response.status !== 200) {
    throw new Error(
      `请求状态异常： ${response.status}, ${response.statusText}`,
    );
  }

  if (response.data.code !== 200) {
    throw new Error(`请求错误：${response.data.msg || '未知错误'}`);
  }

  return response;
};

export { request };
export default request;

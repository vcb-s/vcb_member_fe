import axios, { Method, AxiosResponse, AxiosPromise } from 'axios';

import { token } from './token';
import { PaginationParam } from './types/Pagination';
import { ResponseData } from './types/ResponseData';
import { UserCard } from './types/UserCard';
import { Group } from './types/Group';

const fetch = axios.create({
  baseURL: '/vcbs_member_api',
  withCredentials: false,
});

fetch.interceptors.request.use((config) => {
  config.headers['X-Token'] = token.token;
  config.headers['X-RefreshToken'] = token.refreshToken;

  return config;
});

fetch.interceptors.response.use((reponse) => {
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

const ajax = (param: FetchParam) => {
  const { url, method = 'GET', data } = param;
  switch (method) {
    case 'get':
    case 'GET': {
      return fetch({ url, params: data, method });
    }
    case 'post':
    case 'POST': {
      return fetch({ url, data, method });
    }
    default: {
      return fetch({ url, params: data, method: 'GET' });
    }
  }
};

namespace request {
  export namespace userList {
    export interface ReadParam extends PaginationParam {
      group: Group.Item['id'];
      retired?: UserCard.Item['retired'];
      /** @TODO */
      // sticky?: UserCard.Item['sticky']
    }
    export type ReadResponse = ResponseData.Ok<{
      res: UserCard.ItemInResponse[];
      total: number;
    }>;
    export const read = (data: ReadParam): AxiosPromise<ReadResponse> => {
      return ajax({
        url: '/user/list',
        data: data,
      });
    };
  }
  export namespace group {
    export type ReadResponse = ResponseData.Ok<{
      res: Group.ItemInResponse[];
      total: number;
    }>;
    export const read = (): AxiosPromise<ReadResponse> => {
      return ajax({
        url: '/group/list',
      });
    };
  }
}

export const strictCheck = <T extends ResponseData.Base>(
  response: AxiosResponse<T>,
): T => {
  if (response.status !== 200) {
    throw new Error(
      `请求状态异常： ${response.status}, ${response.statusText}`,
    );
  }

  if (response.data.code !== 200) {
    throw new Error(`请求错误：${response.data.msg || '未知错误'}`);
  }

  return response.data;
};

export { request };
export default request;

export function withPayloadType<T>() {
  return (t: T) => ({ payload: t })
}

export type Promised<S extends Promise<any>> =
  S extends Promise<infer RT> ? RT : never;

export interface PaginationPayload {
  page: number
  pageSize?: number
}
export interface PaginationParam {
  page: number
  pageSize: number
}
export interface Pagination {
  page: number
  pageSize: number
  total: number
}

export namespace ResponseData {
  export interface Base<T extends Record<string, any> = any> {
    code: number
    data?: T
    msg?: string
  }
  export interface Ok<T extends Record<string, any>> extends Base<T> {
    data: T
    msg: never
  }
  export interface Error extends Base {
    data: never
    msg: string
  }
}


export enum GO_BOOL {
  yes = 1,
  no = 2,
}

interface CommonList<T extends any> {
  data: T[]
  loading: boolean
  pagination: Pagination
}

export namespace Group {
  export interface ItemInResponse {
    id: string
    name: string
  }
  export interface Item extends ItemInResponse {
    key: string
  }

  export type List = CommonList<Item>
}

export namespace UserCard {
  export interface ItemInResponse {
    id: string
    retired: GO_BOOL
    avast: string
    bio: string
    nickname: string
    job: string
    order: number
    group: string
  }
  export interface Item extends Omit<ItemInResponse, 'group'> {
    key: string
    group: Group.Item[]
  }
  export type List = CommonList<Item>
}

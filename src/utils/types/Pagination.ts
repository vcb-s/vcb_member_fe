export interface PaginationPayload {
  page: number;
  pageSize?: number;
}
export interface PaginationParam {
  page: number;
  pageSize: number;
}
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export const initalPagination: Pagination = {
  page: 1,
  pageSize: 20,
  total: 0,
};

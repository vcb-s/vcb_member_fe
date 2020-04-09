import { Pagination, initalPagination } from './Pagination';

export interface CommonList<T extends any> {
  data: T[];
  pagination: Pagination;
}

export const emptyList: CommonList<any> = {
  data: [],
  pagination: initalPagination,
};

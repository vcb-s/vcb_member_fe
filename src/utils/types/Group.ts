import { CommonList } from './CommonList';
export namespace Group {
  export interface ItemInResponse {
    id: string;
    name: string;
  }
  export interface Item extends ItemInResponse {
    key: string;
  }
  export type List = Omit<CommonList<Item>, 'pagination'>;
}

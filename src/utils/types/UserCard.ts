import { Group } from './Group';
import { GO_BOOL } from './index';
import { CommonList } from './CommonList';
export namespace UserCard {
  export interface ItemInResponse {
    id: string;
    retired: GO_BOOL;
    avast: string;
    bio: string;
    nickname: string;
    job: string;
    order: number;
    group: string;
  }
  export interface Item extends Omit<ItemInResponse, 'group'> {
    key: string;
    group: Group.Item[];
  }
  export type List = CommonList<Item>;
}

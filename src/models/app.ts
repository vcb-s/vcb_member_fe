import { produce } from 'immer';

import { Action, Reducer, Effect, PromisedType } from '@/utils/types';
import { Group } from '@/utils/types/Group';
import { UserCard } from '@/utils/types/UserCard';
import { emptyList } from '@/utils/types/CommonList';
import { Pagination } from '@/utils/types/Pagination';
import { webpDetect } from '@/utils/webpDetect';
import { request, strictCheck } from '@/utils/request';
import { toast } from '@/utils/dialog';

export namespace AppModels {
  export const namespace = 'app';

  export enum ActionType {
    reset = 'reset',

    getGroup = 'getGroup',
    getGroupSuccess = 'getGroupSuccess',
    getGroupFail = 'getGroupFail',

    changeGroup = 'changeGroup',

    getUserlist = 'getUserlist',
    getUserlistSuccess = 'getUserlistSuccess',
    getUserlistFail = 'getUserlistFail',
  }

  export interface Payload {
    [ActionType.reset]: undefined;

    [ActionType.getGroup]: undefined;
    [ActionType.getGroupSuccess]: {
      data: Group.ItemInResponse[];
    };
    [ActionType.getGroupFail]: { err?: Error };

    [ActionType.changeGroup]: { groupID?: Group.Item['id'] };

    [ActionType.getUserlist]: {
      page: number;
      pageSize?: number;
      groupID?: Group.Item['id'];
    };
    [ActionType.getUserlistSuccess]: {
      data: UserCard.ItemInResponse[];
      group: Group.Item['id'];
      pagination: Pagination;
    };
    [ActionType.getUserlistFail]: { err?: Error };
  }

  /** 统一导出State，降低引用Model时心智负担，统一都使用State就行了 */
  export interface State {
    users: UserCard.List;
    group: Group.List;
    currentGroup: Group.Item['id'];
  }

  export const createAction = <K extends keyof Payload>(key: K) => {
    return (payload: Payload[K]) => {
      return { type: `${namespace}/${key}`, payload: payload };
    };
  };
  export const currentState = (_: any) => _[namespace];
}

const { namespace, currentState } = AppModels;

interface Payload extends AppModels.Payload {}
interface State extends AppModels.State {}

const createAction = <K extends keyof Payload>(key: K) => {
  return (payload: Payload[K]) => {
    return { type: key, payload: payload };
  };
};

const initalState: State = {
  users: emptyList,
  group: emptyList,
  currentGroup: '1',
};

const reducers: Partial<Record<AppModels.ActionType, Reducer<State>>> = {
  [AppModels.ActionType.reset]() {
    return initalState;
  },
  [AppModels.ActionType.getGroupSuccess](
    state,
    { payload }: Action<Payload[AppModels.ActionType.getGroupSuccess]>,
  ) {
    state.group.data = payload.data.map((i) => ({ ...i, key: i.id }));
  },
  [AppModels.ActionType.getGroupFail]() {},
  [AppModels.ActionType.getUserlistSuccess](
    state,
    { payload }: Action<Payload[AppModels.ActionType.getUserlistSuccess]>,
  ) {
    const { group } = state;

    const groupMap: Map<Group.Item['key'], Group.Item> = new Map();
    group.data.forEach((group) => {
      groupMap.set(group.key, group);
    });

    const userList = payload.data.map((user) => {
      const result: UserCard.Item = {
        ...user,
        key: user.id,
        group: user.group
          .split(',')
          .map((id) => groupMap.get(id) || group.data[0])
          .filter((_) => _),
      };

      return result;
    });

    if (payload.pagination.page === 1) {
      state.users.data = userList;
    } else {
      state.users.data = state.users.data.concat(userList);
    }

    state.users.pagination = payload.pagination;
    state.currentGroup = payload.group;
  },
  [AppModels.ActionType.getUserlistFail]() {
    return initalState;
  },
};

const effects: Partial<Record<AppModels.ActionType, Effect>> = {
  *[AppModels.ActionType.getGroup](
    { payload }: Action<Payload[AppModels.ActionType.getGroup]>,
    { call, put },
  ) {
    try {
      const res: ReturnType<typeof request.group.read> = yield call(
        request.group.read,
      );
      const { data } = strictCheck(PromisedType(res));

      yield put(
        createAction(AppModels.ActionType.getGroupSuccess)({
          data: produce(data.res, (draft) => {
            draft.push({ id: '-1', name: '一家人就要整整齐齐' });
          }),
        }),
      );
    } catch (e) {
      toast.show({ content: e.message });
    }
  },
  *[AppModels.ActionType.getUserlist](
    { payload }: Action<Payload[AppModels.ActionType.getUserlist]>,
    { call, put, select, take, race },
  ) {
    const { users, group, currentGroup }: State = yield select(currentState);
    const getGroupLoading: State = yield select(
      (_: any) =>
        _.loading.effects[`${namespace}/${AppModels.ActionType.getGroup}`],
    );
    const {
      page,
      pageSize = users.pagination.pageSize,
      groupID = currentGroup,
    } = payload;

    const param: request.userList.ReadParam = {
      page,
      pageSize,
      group: groupID,
    };
    try {
      if (!group.data.length) {
        if (!getGroupLoading) {
          yield put(createAction(AppModels.ActionType.getGroup)(undefined));
        }
        const { f } = yield race({
          s: take(AppModels.ActionType.getGroupSuccess),
          f: take(AppModels.ActionType.getGroupFail),
        });

        if (f) {
          debugger;
          return;
        }
      }
      const res: ReturnType<typeof request.userList.read> = yield call(
        request.userList.read,
        param,
      );
      const { data } = strictCheck(PromisedType(res));

      let list = data.res;
      try {
        if (yield call(() => webpDetect)) {
          list = produce(list, (draft) => {
            draft.forEach((user) => {
              // 数据库现在有一部分外链图片，这部分不适用文件优化
              if (user.avast.indexOf('//') === -1) {
                // 限定只优化 jpg/png 格式，其他格式如gif什么的就原图展现
                if (/[\.(jpg)|(png)]$/.test(user.avast)) {
                  user.avast = `${user.avast.replace(
                    /(.+)\..+?$/,
                    '$1',
                  )}@600.webp`;
                } else if (!/[\.(gif)]$/.test(user.avast)) {
                  user.avast = `${user.avast.replace(
                    /^(.+)(\..+?)$/,
                    '$1@600$2',
                  )}`;
                }

                user.avast = `https://cache.cswsadlab.com/vcbs_member/uploads/${user.avast}`;
              }
            });
          });
        }
      } catch (e) {
        // 不支持webp，静默失败
      }

      yield put(
        createAction(AppModels.ActionType.getUserlistSuccess)({
          data: list,
          pagination: { page, pageSize, total: data.total },
          group: param.group,
        }),
      );

      /** @TODO 这里列表一次性加载完了 */
      if (data.total > page * pageSize) {
        // 加载下一页
        yield put(
          createAction(AppModels.ActionType.getUserlist)({
            ...payload,
            page: page + 1,
          }),
        );
      }
    } catch (err) {
      yield put(createAction(AppModels.ActionType.getUserlistFail)({ err }));
      toast.show({ content: err.message });
    }
  },
};

export default {
  namespace,
  state: initalState,
  effects,
  reducers,
};

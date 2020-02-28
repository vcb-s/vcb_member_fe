import produce from 'immer'
import { createAction, createSlice } from '@reduxjs/toolkit'

import { webpDetect } from '@/utils/webpDetect'
import { request, strictCheck } from '@/utils/request'
import { withPayloadType, PaginationPayload, Pagination, UserCard, Group } from '@/utils/types'
import { sagasCreator } from '@/utils/sagasCreator'
import { store } from '@/store'
import { reducerManager } from '@/store/rootReducer'
import { toast } from '@/utils/dialog'

const name = '@@app'

export interface State {
  users: UserCard.List
  group: Group.List
  currentGroup: Group.Item['id']
}
const initialState: State = {
  users: {
    data: [],
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
    },
    loading: false,
  },
  group: {
    data: [],
    loading: false,
  },
  /** 约定：1 为管理组 */
  currentGroup: '1'
}

const getCurrentState = (): State => store.getState()[name]

export namespace Payloads {
  export namespace getUserlist {
    export interface fetch extends PaginationPayload {
      groupID?: Group.Item['id']
    }
    export interface success {
      data: UserCard.ItemInResponse[]
      pagination: Pagination
    }
    export type loading = boolean
  }
  export namespace getGroup {
    export interface success {
      data: Group.ItemInResponse[]
    }
    export interface changeSelect {
      groupID: Group.Item['id']
    }
    export type loading = boolean
  }
}

export namespace Actions {
  export const INIT = createAction(`${name}/init`, withPayloadType<void>())

  export const initDataLoad = createAction(`${name}/init`, withPayloadType<void>())
  export namespace getUserlist {
    export const fetch = createAction(`${name}/getUserlist`, withPayloadType<Payloads.getUserlist.fetch>())
    export const success = createAction(`${name}/getUserlistSuccess`, withPayloadType<Payloads.getUserlist.success>())
    // export const fail = createAction(`${name}/getUserlistFail`, withPayloadType<PaginationPayload>())
    export const loading = createAction(`${name}/getUserlistLoading`, withPayloadType<Payloads.getUserlist.loading>())

    export const reset = createAction(`${name}/getUserlistReset`, withPayloadType<PaginationPayload>())
  }
  export namespace getGroup {
    export const fetch = createAction(`${name}/getGroup`, withPayloadType<void>())
    export const success = createAction(`${name}/getGroupSuccess`, withPayloadType<Payloads.getGroup.success>())
    // export const fail = createAction(`${name}/getGroupFail`, withPayloadType<PaginationPayload>())
    export const loading = createAction(`${name}/getGroupLoading`, withPayloadType<Payloads.getGroup.loading>())

    export const changeSelect = createAction(`${name}/getChangeGroupSelect`, withPayloadType<Payloads.getGroup.changeSelect>())

    export const reset = createAction(`${name}/getGroupReset`, withPayloadType<PaginationPayload>())
  }
}

const sagas = sagasCreator(builder => {
  builder
    .addCase(Actions.getGroup.fetch, async () => {
      try {
        store.dispatch(Actions.getGroup.loading(true))

        const { data } = strictCheck(await request.group.read())
        store.dispatch(Actions.getGroup.success({
          data: produce(data.res, draft => {
            draft.push({ id: '-1', name: '一家人就要整整齐齐' })
          }),
        }))
      } catch (e) {
        toast.show({ content: e.message })
      }

      store.dispatch(Actions.getGroup.loading(false))
    })
    .addCase(Actions.getUserlist.fetch, async ({ payload }) => {
      const { users, group, currentGroup } = getCurrentState()
      const { page, pageSize = users.pagination.pageSize, groupID = currentGroup } = payload
      try {
        store.dispatch(Actions.getUserlist.loading(true))

        if (!group.data.length) {
          await sagas(Actions.getGroup.fetch())
        }
        const { data } = strictCheck(await request.userList.read({ page, pageSize, group: groupID }))
        let list = data.res
        try {
          await webpDetect
          list = produce(list, draft => {
            draft.forEach(user => {
              // 数据库现在有一部分外链图片，这部分不适用文件优化
              if (user.avast.indexOf('//') === -1) {
                // 限定只优化 jpg/png 格式，其他格式如gif什么的就原图展现
                if (/[\.(jpg)|(png)]$/.test(user.avast)) {
                  user.avast = `${user.avast.replace(/(.+)\..+?$/, '$1')}@600.webp`
                } else if (!/[\.(gif)]$/.test(user.avast)) {
                  user.avast = `${user.avast.replace(/^(.+)(\..+?)$/, '$1@600$2')}`
                }

                user.avast = `https://cache.cswsadlab.com/vcbs_member/uploads/${user.avast}`
              }
            })
          })
        } catch (e) {
          // 不支持webp，静默失败
        }
        store.dispatch(Actions.getUserlist.success({
          data: list,
          pagination: { page, pageSize, total: data.total }
        }))
        store.dispatch(Actions.getGroup.changeSelect({ groupID }))

        /** @TODO 这里列表一次性加载完了 */
        if (data.total > page * pageSize) {
          // 加载下一页
          setTimeout(() => {
            sagas(Actions.getUserlist.fetch(produce(payload, draft => {
              draft.page = page + 1
            })))
          })
        }
      } catch (e) {
        toast.show({ content: e.message })
      }
      store.dispatch(Actions.getUserlist.loading(false))
    })
})

export const slice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: build => {
    build
      .addCase(Actions.INIT, () => undefined)
      .addCase(Actions.getGroup.success, (state, { payload }) => {
        state.group.data = payload.data.map(group => {
          const result: Group.Item = {
            ...group,
            key: group.id,
          }

          return result
        })
      })
      .addCase(Actions.getUserlist.success, (state, { payload }) => {
        const { group } = state

        const groupMap: Map<Group.Item['key'], Group.Item> = new Map()
        group.data.forEach(group => {
          groupMap.set(group.key, group)
        })

        const userList = payload.data.map(user => {
          const result: UserCard.Item = {
            ...user,
            key: user.id,
            group: user.group.split(',').map(id => groupMap.get(id) || null).filter(_ => _),
          }

          return result
        })

        if (payload.pagination.page === 1) {
          state.users.data = userList
        } else {
          state.users.data = state.users.data.concat(userList)
        }

        state.users.pagination = payload.pagination
      })
      .addCase(Actions.getUserlist.loading, (state, { payload }) => {
        state.users.loading = payload
      })
      .addCase(Actions.getGroup.loading, (state, { payload }) => {
        state.users.loading = payload
      })
      .addCase(Actions.getGroup.changeSelect, (state, { payload }) => {
        state.currentGroup = payload.groupID
      })
  }
})

reducerManager.add(slice.name, slice.reducer)
store.dispatch(Actions.INIT())

export { sagas }
export default slice

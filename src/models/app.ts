import produce from 'immer'
import { createAction, createSlice } from '@reduxjs/toolkit'

import { webpDetect } from '~/utils/webpDetect'
import { request, strictCheck } from '~/utils/request'
import { withPayloadType, PaginationPayload, Pagination, UserCard, Group } from '~/utils/types'
import { sagasCreator } from '~/utils/sagasCreator'
import { store } from '~/store'
import { reducerManager } from '~/store/rootReducer'
import { toast } from '~/utils/dialog'

const name = '@@app'

export interface State {
  users: UserCard.List
  group: Group.List
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
}

const getCurrentState = (): State => store.getState()[name]

export namespace Payloads {
  export namespace getUserlist {
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
    export type loading = boolean
  }
}

export namespace Actions {
  export const INIT = createAction(`${name}/init`, withPayloadType<void>())

  export const initDataLoad = createAction(`${name}/init`, withPayloadType<void>())
  export namespace getUserlist {
    export const fetch = createAction(`${name}/getUserlist`, withPayloadType<PaginationPayload>())
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
          data: data.res,
        }))
      } catch (e) {
        toast.show({ content: e.message })
      }

      store.dispatch(Actions.getGroup.loading(false))
    })
    .addCase(Actions.getUserlist.fetch, async ({ payload }) => {
      const { users, group } = getCurrentState()
      const { page, pageSize = users.pagination.pageSize } = payload
      try {
        store.dispatch(Actions.getUserlist.loading(true))

        if (!group.data.length) {
          await sagas(Actions.getGroup.fetch())
        }
        const { data } = strictCheck(await request.userList.read({ page, pageSize }))
        let list = data.res
        try {
          await webpDetect
          list = produce(list, draft => {
            draft.forEach(user => {
              if (/[\.(jpg)|(png)]$/.test(user.avast)) {
                user.avast = `${user.avast.replace(/(.+)\..+?$/, '$1')}@600.webp`
              } else {
                user.avast = `${user.avast.replace(/^(.+)(\..+?)$/, '$1@600$2')}`
              }

              user.avast = `https://cache.cswsadlab.com/vcbs_member/uploads/${user.avast}`
            })
          })
        } catch (e) {
          // 不支持webp，静默失败
        }
        store.dispatch(Actions.getUserlist.success({
          data: list,
          pagination: { page, pageSize, total: data.total }
        }))
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
        state.users.data = payload.data.map(user => {
          const result: UserCard.Item = {
            ...user,
            key: user.id,
            group: user.group.split(',').map(id => groupMap.get(id) || null).filter(_ => _),
          }

          return result
        })

        state.users.pagination = payload.pagination
      })
      .addCase(Actions.getUserlist.loading, (state, { payload }) => {
        state.users.loading = payload
      })
      .addCase(Actions.getGroup.loading, (state, { payload }) => {
        state.users.loading = payload
      })
  }
})

reducerManager.add(slice.name, slice.reducer)
store.dispatch(Actions.INIT())

sagas(Actions.getUserlist.fetch({ page: 1 }))

export { sagas }
export default slice

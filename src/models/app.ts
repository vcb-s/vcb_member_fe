import { createAction, createSlice } from '@reduxjs/toolkit'

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
  }
  export namespace getGroup {
    export interface success {
      data: Group.ItemInResponse[]
    }
  }
}

export namespace Actions {
  export const INIT = createAction(`${name}/init`, withPayloadType<void>())

  export const load = createAction(`${name}/init`, withPayloadType<void>())
  export namespace getUserlist {
    export const fetch = createAction(`${name}/getUserlist`, withPayloadType<PaginationPayload>())
    export const success = createAction(`${name}/getUserlistSuccess`, withPayloadType<Payloads.getUserlist.success>())
    // export const fail = createAction(`${name}/getUserlistFail`, withPayloadType<PaginationPayload>())

    export const reset = createAction(`${name}/getUserlistReset`, withPayloadType<PaginationPayload>())
  }
  export namespace getGroup {
    export const fetch = createAction(`${name}/getGroup`, withPayloadType<void>())
    export const success = createAction(`${name}/getGroupSuccess`, withPayloadType<Payloads.getGroup.success>())
    // export const fail = createAction(`${name}/getGroupFail`, withPayloadType<PaginationPayload>())

    export const reset = createAction(`${name}/getGroupReset`, withPayloadType<PaginationPayload>())
  }
}

const sagas = sagasCreator(builder => {
  builder
    .addCase(Actions.getGroup.fetch, async () => {
      try {
        const { data } = strictCheck(await request.group.read())
        store.dispatch(Actions.getGroup.success({
          data: data.res,
        }))
      } catch (e) {
        toast.show({ content: e.message })
      }
    })
    .addCase(Actions.getUserlist.fetch, async ({ payload }) => {
      const { users, group } = getCurrentState()
      const { page, pageSize = users.pagination.pageSize } = payload
      try {
        if (!group.data.length) {
          await sagas(Actions.getGroup.fetch())
        }
        const { data } = strictCheck(await request.userList.read({ page, pageSize }))
        store.dispatch(Actions.getUserlist.success({
          data: data.res,
          pagination: { page, pageSize, total: data.total }
        }))
      } catch (e) {
        toast.show({ content: e.message })
      }
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
            group: user.group.split(',').map(id => groupMap.get(id) || null).filter(_ => _)
          }
          return result
        })

        state.users.pagination = payload.pagination
      })
  }
})

reducerManager.add(slice.name, slice.reducer)
store.dispatch(Actions.INIT())

sagas(Actions.getUserlist.fetch({ page: 1 }))

export { sagas }
export default slice

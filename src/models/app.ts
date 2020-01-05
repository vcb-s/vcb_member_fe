import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { request, strictCheck } from '~/utils/request'
import { withPayloadType, PaginationPayload, Promised, UserCard, Group } from '~/utils/types'
import { sagasCreator } from '~/utils/sagasCreator'
import { store } from '~/store'
import { reducerManager } from '~/store/rootReducer'
import { toast, model } from '~/utils/dialog'

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
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
    },
    loading: false,
  },
}

const currentState = (): State => store.getState()[name]

export namespace Payloads {
}

export namespace Actions {
  export const INIT = createAction(`${name}/init`, withPayloadType<void>())

  export const load = createAction(`${name}/init`, withPayloadType<void>())
  export namespace getUserlist {
    export const fetch = createAction(`${name}/getUserlist`, withPayloadType<PaginationPayload>())
    export const success = createAction(`${name}/getUserlistSuccess`, withPayloadType<PaginationPayload>())
    export const fail = createAction(`${name}/getUserlistFail`, withPayloadType<PaginationPayload>())

    export const reset = createAction(`${name}/getUserlistReset`, withPayloadType<PaginationPayload>())
  }
  export namespace getGroup {
    export const fetch = createAction(`${name}/getGroup`, withPayloadType<PaginationPayload>())
    export const success = createAction(`${name}/getGroupSuccess`, withPayloadType<PaginationPayload>())
    export const fail = createAction(`${name}/getGroupFail`, withPayloadType<PaginationPayload>())

    export const reset = createAction(`${name}/getGroupReset`, withPayloadType<PaginationPayload>())
  }
}

const sagas = sagasCreator(builder => {
  builder
    .addCase(Actions.getUserlist.fetch, async ({ payload }) => {
      const { users } = currentState()
      const { page, pageSize = users.pagination.pageSize } = payload
      try {
        const res = strictCheck(await request.userList.read({ page, pageSize }))
        console.log('what is res', res)
        toast.show({ content: '加载成功' })
        model.show({ content: '加载成功' })
      } catch (e) {
        //
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
  }
})

reducerManager.add(slice.name, slice.reducer)
store.dispatch(Actions.INIT())

sagas(Actions.getUserlist.fetch({ page: 1 }))

export { sagas }
export default slice

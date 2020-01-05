import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'

import store, { reducerManager } from '~/store'
import { withPayloadType, PaginationPayload } from '~/utils/types'

const name = '@@pages.index'

export interface State {
  //
}
const initialState: State = {}

export namespace Payloads {
  export interface INIT {
    time: Date
  }
}

export namespace Actions {
  export const INIT = createAction(`${name}/init`, withPayloadType<void>())
}

const slice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: build => {
    build.addCase(Actions.INIT, _ => _)
  }
})

reducerManager.add(slice.name, slice.reducer)
store.dispatch(Actions.INIT())

export { slice }
export default slice

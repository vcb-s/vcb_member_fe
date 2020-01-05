import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'

import store, { reducerManager } from '~/store'

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
  export const INIT = createAction<Payloads.INIT>(`${name}/init`)
}

const slice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: build => {
    build.addCase(Actions.INIT, (state, aciton) => {
      return state
    })
  }
})

reducerManager.add(slice.name, slice.reducer)
store.dispatch(Actions.INIT())

export { slice }
export default slice

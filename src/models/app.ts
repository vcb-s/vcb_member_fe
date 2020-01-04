import { createAction, createSlice } from '@reduxjs/toolkit'

const name = '@@app'

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

export const slice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: build => {
    build.addCase(Actions.INIT, (state, aciton) => {
      //
    })
  }
})

export default slice

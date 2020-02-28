import { createAction, createSlice } from '@reduxjs/toolkit'

import { withPayloadType } from '@/utils/types'
import { store } from '@/store'
import { reducerManager } from '@/store/rootReducer'

const name = '@@dialog'

export interface AlertItem {
  key: string
  id: string
  title: string
  content: string
}

export interface ToastItem {
  key: string
  id: string
  content: string
}

export interface State {
  alert: AlertItem[],
  toast: ToastItem[]
}
const initialState: State = {
  alert: [],
  toast: []
}

const currentState = (): State => store.getState()[name]

export namespace Payloads {
  export namespace Alert {
    export type show = { id: string, title: string, content: string }
    export type hide = { id?: string }
  }

  export namespace Toast {
    export type show = { id: string, content: string }
    export type hide = { id?: string }
  }
}

export namespace Actions {
  export const INIT = createAction(`${name}/init`, withPayloadType<void>())

  export namespace Alert {
    export const show = createAction(`${name}/showAlert`, withPayloadType<Payloads.Alert.show>())
    export const hide = createAction(`${name}/hideAlert`, withPayloadType<Payloads.Alert.hide>())
  }

  export namespace Toast {
    export const show = createAction(`${name}/showToast`, withPayloadType<Payloads.Toast.show>())
    export const hide = createAction(`${name}/hideToast`, withPayloadType<Payloads.Toast.hide>())
  }
}

export const slice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: build => {
    build
      .addCase(Actions.INIT, () => undefined)
      .addCase(Actions.Alert.show, (state, { payload }) => {
        state.alert.push({
          key: payload.id,
          id: payload.id,
          title: payload.title,
          content: payload.content,
        })
      })
      .addCase(Actions.Alert.hide, (state, { payload }) => {
        if (payload.id) {
          state.toast = state.toast.filter(toast => toast.id !== payload.id)
        } else {
          state.toast = []
        }
      })
      .addCase(Actions.Toast.show, (state, { payload }) => {
        state.toast.push({
          key: payload.id,
          id: payload.id,
          content: payload.content,
        })
      })
      .addCase(Actions.Toast.hide, (state, { payload }) => {
        if (payload.id) {
          state.toast = state.toast.filter(toast => toast.id !== payload.id)
        } else {
          state.toast = []
        }
      })
  }
})



reducerManager.add(slice.name, slice.reducer)
store.dispatch(Actions.INIT())

export default slice

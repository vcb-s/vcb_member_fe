import store from '@/store'
import ID from '@/utils/union_id'
import { Actions } from '@/models/dialog'

export interface AlertParam {
  title?: string
  content: string
}
export const model = {
  show: (opt: AlertParam|Error) => {
    const id = `${ID()}`
    if (opt instanceof Error) {
      store.dispatch(Actions.Alert.show({ id, title: '提示', content: opt.message }))
    } else {
      const { title = '提示', content } = opt
      store.dispatch(Actions.Alert.show({ id, title, content }))
    }
  },
  hide: (id?: string) => {
    store.dispatch(Actions.Alert.hide({ id }))
  }
}

export interface ToastParam {
  content: string
  time?: number
}
export const toast = {
  show: (opt: ToastParam) => {
    const { content, time = 1500 } = opt
    const id = setTimeout(() => {
      store.dispatch(Actions.Toast.hide({ id }))
    }, time).toString()
    store.dispatch(Actions.Toast.show({ id, content }))
  },
  hide: (id?: string) => {
    store.dispatch(Actions.Toast.hide({ id }))
  }
}

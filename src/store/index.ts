import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import reducer, { reducerManager } from './root'

export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware()
})

export { reducerManager }
export default store

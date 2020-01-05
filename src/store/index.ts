import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'


import { reducerManager } from './rootReducer'

const store = configureStore({
  reducer: reducerManager.reduce,
  middleware: [
    ...getDefaultMiddleware(),
  ]
})

export { store }
export { reducerManager }
export default store

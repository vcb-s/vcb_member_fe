import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import reducer from './root'

export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware()
})

if (process.env.NODE_ENV !== 'production' && (module as any).hot) {
  (module as any).hot.accept('./root', () => store.replaceReducer(reducer))
}

export default store

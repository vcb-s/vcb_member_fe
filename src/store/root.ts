import { combineReducers } from '@reduxjs/toolkit'

import { slice } from '../models/app'

export const rootReducer = combineReducers({
  [slice.name]: slice.reducer
})

export default rootReducer

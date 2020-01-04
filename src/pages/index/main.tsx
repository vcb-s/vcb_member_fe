import React from 'react'
import { useSelector } from 'react-redux'

import appSlice from '~/models/app'

export default React.memo(function IndexPage () {
  const appState = useSelector(state => state[appSlice.name])
  console.log('what is state', appState)

  return (
    <>hello world</>
  )
})

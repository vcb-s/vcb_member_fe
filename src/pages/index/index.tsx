import React from 'react'
import { useSelector } from 'react-redux'

export default React.memo(function IndexPage () {
  const appState = useSelector(_ => _)
  console.log('what is state', appState)

  return (
    <>hello world</>
  )
})

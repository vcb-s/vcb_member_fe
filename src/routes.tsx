import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Index from './pages/index'

const RootRoute = () => {
  return (
    <Switch>
      <Route path="/" component={Index} />

      {/* fallback */}
      <Route children={<Redirect to="/" />} />
    </Switch>
  )
}

export default RootRoute

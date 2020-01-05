import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import 'typeface-roboto'

import Routes from './routes'
import { Dialogs } from '~/components/dialog'

import store from './store'

import './models/app'

export default class Root extends React.PureComponent {
  render () {
    return (
      <Provider store={store}>
        <CssBaseline />
        <Dialogs />

        <Router>
          <Routes />
        </Router>
      </Provider>
    )
  }
}

import React from 'react'
import ReactDOM from 'react-dom'

import Root from './root'
import poyfill from '~/utils/asyncPoyfill'

const rootElement = document.createElement('div')
document.body.append(rootElement)

poyfill().then(() => {
  ReactDOM.render(<Root />, rootElement)
})

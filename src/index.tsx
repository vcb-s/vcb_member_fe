import React from 'react'
import ReactDOM from 'react-dom'

import Root from './root'
import poyfill from '~/utils/asyncPoyfill'

let rootElement: HTMLElement = document.createElement('div')
rootElement.id = 'root'
if (document.getElementById('root')) {
  rootElement = document.getElementById('root')
} else {
document.body.append(rootElement)
}

poyfill().then(() => {
  ReactDOM.render(<Root />, rootElement)
})

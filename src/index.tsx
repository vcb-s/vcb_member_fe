import React from 'react'
import ReactDOM from 'react-dom'

import Root from './root'

const rootElement = document.createElement('div')
document.body.append(rootElement)

ReactDOM.render(<Root />, rootElement)

import React, { FunctionComponent, memo } from 'react'

import loadingIcon from '@/assets/loading.svg'
import './index.scss'

interface Props {
  show?: boolean
}
const Loading: FunctionComponent<Props> = ({ show = true }) => {
  if (!show) {
    return null
  }

  return (
    <div className='com_loadingWrap'>
      <img className='com_loading' src={loadingIcon} alt='' />
    </div>
  )
}

export default memo(Loading)

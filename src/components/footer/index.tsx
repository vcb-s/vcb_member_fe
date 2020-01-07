import React, { FC, useState, memo } from 'react'

import './index.scss'

export interface Props {
  hide: boolean
}
const Footer: FC<Props> = props => {
  const { hide } = props
  if (hide) {
    return null
  }

  return (
    <div className='com_footer'>
      <div className='com_footer_label'>我们的征途是星河大海 Powered By <a href="https://vcb-s.com">VCB-Studio</a></div>
    </div>
  )
}

export default memo(Footer)

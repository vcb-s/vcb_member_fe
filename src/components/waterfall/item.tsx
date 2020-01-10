import React, { FC, useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import { UserCard } from '~/utils/types'

import './index.scss'

interface WaterFallListItemProps {
  data: UserCard.Item
  className?: string
  onResize?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
}
type WaterFallListItem = FC<WaterFallListItemProps>
const WaterFallListItem: WaterFallListItem = ({ data, className, onResize }) => {
  const [show, setShow] = useState(false)
  const [ref, inView] = useInView()
  const [height, setHeight] = useState('0px')

  useEffect(() => {
    if (inView && !show) {
      setShow(true)
    }
  }, [inView])

  const imgLoadedHandle = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHeight('auto')
    onResize && onResize(e)
  }
  const errorHandle = () => {
    const avast = data.avast
    const errmsg = avast.replace(/^(.+\/)(.+)(\.)(.+)$/, `图片加载失败：$2 - $4\n$2$3$4`)
    console.warn(errmsg)
  }

  return (
    <div className={`com_waterfall_item ${className} ${ data.retired ? 'retired' : 'not_retired' }`} ref={ ref }>
      <div className='com_waterfall_item_avast'>
        {/* decoding=async 会触发一次chrome内置的lazy逻辑，导致快速滚动时会出现img的图片请求会出现瞬间被cancel的现象 */}
        <img src={show ? data.avast : undefined} onLoad={imgLoadedHandle} onError={errorHandle} style={{ height }} />
      </div>
      <div className='com_waterfall_item_text_meta'>
        <div className='com_waterfall_item_text_nickname'>{ data.nickname }</div>
        <div className='com_waterfall_item_text_job'>{ data.job }</div>
      </div>
      <div className='com_waterfall_item_bio'>{ data.bio }</div>
    </div>
  )
}

export { WaterFallListItem }
export default WaterFallListItem

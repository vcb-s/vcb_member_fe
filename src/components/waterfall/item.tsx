import React, { FC, useState, useEffect, useCallback } from 'react'
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
  const [avast, setAvast] = useState('')
  const [ref, inView] = useInView()
  const [height, setHeight] = useState('0px')

  useEffect(() => {
    if (inView) {
      setAvast(data.avast)
    }
  }, [inView])

  const imgLoadedHandle = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHeight('auto')
    onResize && onResize(e)
  }, [setHeight])

  const errorHandle = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const errmsg = avast.replace(/^(.+\/)(.+)(\.)(.+)$/, `图片加载失败：$2 - $4\n$2$3$4`)
    console.warn(errmsg)
    onResize && onResize(e)
  }, [avast])

  return (
    <div className={`com_waterfall_item ${className} ${ data.retired ? 'retired' : 'not_retired' }`} ref={ ref }>
      <div className='com_waterfall_item_avast'>
        {/* decoding=async 会触发一次chrome内置的lazy逻辑，导致快速滚动时会出现img的图片请求会出现瞬间被cancel的现象 */}
        <img src={avast} onLoad={imgLoadedHandle} onError={errorHandle} style={{ height }} />
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

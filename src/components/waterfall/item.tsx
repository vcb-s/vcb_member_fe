import React, { FC, useState, useEffect, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { useMedia } from 'react-use'
import classnames from 'classnames'

import { UserCard, GO_BOOL } from '~/utils/types'

import './index.scss'

declare module 'react' {
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    referrerpolicy?: 'no-referrer'|'no-referrer-when-downgrade'|'origin'|'origin-when-cross-origin'|'unsafe-url'
  }
}

interface WaterFallListItemProps {
  data: UserCard.Item
  className?: string
  onResize?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
}
type WaterFallListItem = FC<WaterFallListItemProps>
const WaterFallListItem: WaterFallListItem = ({ data, className, onResize }) => {
  const [avast, setAvast] = useState('')
  const [ref, inView] = useInView()
  const isWide = useMedia('(min-width: 1080px)')

  useEffect(() => {
    if (inView) {
      setAvast(data.avast)
    }
  }, [inView])

  const imgLoadedHandle = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    onResize && onResize(e)
  }, [])

  const errorHandle = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const errmsg = avast.replace(/^(.+\/)(.+)(\.)(.+)$/, `图片加载失败：$2 - $4\n$2$3$4`)
    console.warn(errmsg)
    onResize && onResize(e)
  }, [avast])

  return (
    <div
      className={
        classnames({
          'com_waterfall_item': true,
          [className]: !!className,
          'retired': data.retired === GO_BOOL.yes,
          'small': !isWide,
        })
      }
      ref={ ref }
    >
      <div className='com_waterfall_item_avast'>
        {/* decoding=async 会触发一次chrome内置的lazy逻辑，导致快速滚动时会出现img的图片请求会出现瞬间被cancel的现象 */}
        <img
          src={avast}
          onLoad={imgLoadedHandle}
          onError={errorHandle}
          referrerpolicy='no-referrer'
          crossOrigin='anonymous'
        />
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

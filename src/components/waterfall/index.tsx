import React, { useEffect, useCallback, useMemo } from 'react';
import masonry from 'masonry-layout';
import { useMedia } from 'react-use';

import { UserCard } from '@/utils/types/UserCard';
import { WaterFallListItem } from './item';

import { Size } from '@/utils/types/waterfall_size';

import './index.scss';

interface WaterFallProps {
  data: UserCard.Item[];

  /** 布局方式 */
  size?: Size;
}

/** 瀑布容器 */
const WaterFall: React.FC<WaterFallProps> = React.memo(function WaterFall(
  props,
) {
  const { data, size } = props;

  const masonryNodeRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const masonryInstanceRef = React.useRef<null | Record<string, any>>(null);
  const masonryUpdateDelayRef = React.useRef<number>(0);
  const isWide = useMedia('(min-width: 1080px)');

  /** 混合判断逻辑后的size取值 */
  const innerSize = useMemo(() => {
    if (size) {
      return size;
    }

    if (!isWide) {
      return Size.small;
    }

    return Size.normal;
  }, [isWide, size]);

  /** debounce 后的重排函数 */
  const relayoutHandle = useCallback(() => {
    if (masonryUpdateDelayRef.current) {
      window.clearTimeout(masonryUpdateDelayRef.current);
    }

    masonryUpdateDelayRef.current = window.setTimeout(() => {
      const masonryInstance = masonryInstanceRef.current;

      if (!masonryInstance) {
        return;
      }

      masonryInstance.layout();
    }, 50);
  }, []);

  useEffect(() => {
    const node = masonryNodeRef.current;
    if (node) {
      const masonryInstance = new masonry(node, {
        itemSelector: '.grid-item',
        // columnWidth: innerSize === Size.nano ? 100 : 240,
        gutter: 15,
        fitWidth: true,
      });

      masonryInstanceRef.current = masonryInstance;

      return () => {
        try {
          masonryInstance.destory();
        } catch (e) {}

        masonryInstanceRef.current = null;
      };
    }
  }, [data]);

  return (
    <div className='com_waterfall_container'>
      <div className='com_waterfall_list' ref={masonryNodeRef}>
        {data.map((item) => (
          <WaterFallListItem
            key={item.id}
            className='grid-item'
            data={item}
            onResize={relayoutHandle}
            size={innerSize}
          />
        ))}
      </div>
    </div>
  );
});

export { WaterFall };

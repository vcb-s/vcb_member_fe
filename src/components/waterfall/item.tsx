import React, { FC, useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { useMedia } from 'react-use';
import classnames from 'classnames';

import { GO_BOOL } from '@/utils/types';
import { UserCard } from '@/utils/types/UserCard';

import './index.scss';

interface WaterFallListItemProps {
  data: UserCard.Item;
  className?: string;
  onResize?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}
type WaterFallListItem = FC<WaterFallListItemProps>;
const WaterFallListItem: WaterFallListItem = ({
  data,
  className = '',
  onResize,
}) => {
  const [avast, setAvast] = useState('');
  const [ref, inView] = useInView();
  const isWide = useMedia('(min-width: 1080px)');

  useEffect(() => {
    if (inView) {
      setAvast(data.avast);
    }
  }, [data.avast, inView]);

  const imgLoadedHandle = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      onResize && onResize(e);
    },
    [onResize],
  );

  const errorHandle = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const errmsg = avast.replace(
        /^(.+\/)(.+)(\.)(.+)$/,
        `图片加载失败：$2 - $4\n$2$3$4`,
      );
      console.warn(errmsg);
      onResize && onResize(e);
    },
    [avast, onResize],
  );

  return (
    <div
      className={classnames({
        com_waterfall_item: true,
        [className]: !!className,
        retired: data.retired === GO_BOOL.yes,
        small: !isWide,
      })}
      ref={ref}
    >
      <div className='com_waterfall_item_avast'>
        <img
          src={avast}
          onLoad={imgLoadedHandle}
          onError={errorHandle}
          referrerPolicy='no-referrer'
        />
      </div>
      <div className='com_waterfall_item_text_meta'>
        <div className='com_waterfall_item_text_nickname'>
          {data.nickname}
          {data.retired === GO_BOOL.yes ? (
            <div className='retiredTag' title='荣誉退休'>
              休
            </div>
          ) : null}
        </div>
        <div className='com_waterfall_item_text_job'>{data.job}</div>
      </div>
      <div className='com_waterfall_item_bio'>{data.bio}</div>
    </div>
  );
};

export { WaterFallListItem };
export default WaterFallListItem;

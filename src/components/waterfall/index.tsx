import React from 'react';
import masonry from 'masonry-layout';

import { UserCard } from '@/utils/types/UserCard';
import { WaterFallListItem } from './item';

import './index.scss';

interface WaterFallProps {
  data: UserCard.Item[];
}
class WaterFall extends React.PureComponent<WaterFallProps> {
  private masonryUpdateDelay = 0;
  private masonryNode: React.RefObject<HTMLDivElement> = React.createRef();

  private MasonryInstance: null | Record<string, any> = null;
  componentDidMount = () => {
    if (this.masonryNode.current) {
      const node = this.masonryNode.current;
      this.initalMasonry(node);
    }
  };
  componentDidUpdate = () => {
    if (this.masonryNode.current) {
      const node = this.masonryNode.current;
      this.initalMasonry(node);
    }
  };

  componentWillUnmount = () => {
    const MasonryInstance = this.MasonryInstance;
    if (MasonryInstance && MasonryInstance.destory) {
      MasonryInstance.destory();
    }
  };

  private initalMasonry = (node: HTMLDivElement) => {
    const MasonryInstance = this.MasonryInstance;
    if (MasonryInstance && MasonryInstance.destory) {
      MasonryInstance.destory();
    }
    this.MasonryInstance = new masonry(node, {
      itemSelector: '.grid-item',
      columnWidth: 240,
      gutter: 15,
      fitWidth: true,
    });
  };

  reLayoutHandle = () => {
    if (this.masonryUpdateDelay) {
      clearTimeout(this.masonryUpdateDelay);
    }
    this.masonryUpdateDelay = window.setTimeout(() => {
      const MasonryInstance = this.MasonryInstance;
      if (MasonryInstance) {
        MasonryInstance.layout();
      }
    }, 50);
  };

  render() {
    let { data } = this.props;

    return (
      <div className='com_waterfall_container'>
        <div className='com_waterfall_list' ref={this.masonryNode}>
          {data.map((item) => (
            <WaterFallListItem
              key={item.id}
              className='grid-item'
              data={item}
              onResize={this.reLayoutHandle}
            />
          ))}
        </div>
      </div>
    );
  }
}

export { WaterFall };
export default WaterFall;

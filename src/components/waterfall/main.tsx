import { useMedia } from "react-use";

import { UserCard } from "@/utils/types/UserCard";
import { WaterFallListItem } from "./item";

import { Size } from "@/utils/types/waterfall_size";
import { useMasonry } from "@/hooks/useMasonry";

import "./index.scss";

interface Props {
  data: UserCard.Item[];

  /** 布局方式 */
  size?: Size;
}

export default memo(function WaterFallList({ data, size: sizeFromProps }: Props) {
  const isWide = useMedia("(min-width: 1080px)");
  /** 混合判断逻辑后的size取值 */
  const size = useMemo(() => {
    if (sizeFromProps) {
      return sizeFromProps;
    }

    if (!isWide) {
      return Size.small;
    }

    return Size.normal;
  }, [isWide, sizeFromProps]);

  const [masonryNodeRef, { layout: relayoutHandle }] = useMasonry<HTMLDivElement>();

  return (
    <div className="com_waterfall_container">
      <div className="com_waterfall_list" ref={masonryNodeRef}>
        {data.map((item) => (
          <WaterFallListItem key={item.id} data={item} onResize={relayoutHandle} size={size} />
        ))}
      </div>
    </div>
  );
});

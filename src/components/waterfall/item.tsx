import { FC } from "react";
import { useInView } from "react-intersection-observer";

import { GO_BOOL } from "@/utils/types";
import { Size } from "@/utils/types/waterfall_size";
import { UserCard } from "@/utils/types/UserCard";

import "./index.scss";

interface WaterFallListItemProps {
  data: UserCard.Item;
  className?: string;
  onResize?: () => void;

  /** 布局方式 */
  size: Size;
}
type WaterFallListItem = FC<WaterFallListItemProps>;
const WaterFallListItem: WaterFallListItem = ({ data, className = "", onResize, size }) => {
  const [avast, setAvast] = useState("");
  const [ref, inView] = useInView();
  const [forceSize, setForceSize] = useState<Size | null>(null);

  /** 点击头像是放大nano的 */
  const avastClickHandle = useCallback(() => {
    if (size !== Size.nano) {
      return;
    }

    setForceSize((currentSize) => (currentSize ? Size.nano : null));
  }, [size]);

  const innerSize = useMemo(() => forceSize || size, [forceSize, size]);

  /** 当inView之后就设置加载图片 */
  useEffect(() => {
    if (inView) {
      setAvast(data.avast);
    }
  }, [data.avast, inView]);

  /** 触发重排逻辑 */
  const imgLoadedHandle = useCallback(() => {
    if (size !== Size.nano) {
      onResize && onResize();
    }
  }, [size, onResize]);

  /** 图片加载错误fallback */
  const errorHandle = useCallback(() => {
    const errmsg = avast.replace(/^(.+\/)(.+)(\.)(.+)$/, `图片加载失败：$2 - $4\n$2$3$4`);
    console.warn(errmsg);
    onResize && onResize();
  }, [avast, onResize]);

  useEffect(() => {
    onResize && onResize();
  }, [forceSize, onResize]);

  return (
    <div
      className={classnames({
        com_waterfall_item: true,
        [innerSize]: true,
        [className]: !!className,
        retired: data.retired === GO_BOOL.yes,
      })}
      ref={ref}
    >
      <div className="com_waterfall_item_avast">
        <img
          src={avast}
          onLoad={imgLoadedHandle}
          onError={errorHandle}
          onClick={avastClickHandle}
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="com_waterfall_item_text_meta">
        <div className="com_waterfall_item_text_nickname">
          {data.nickname}
          {data.retired === GO_BOOL.yes ? (
            <div className="retiredTag" title="荣誉退休">
              休
            </div>
          ) : null}
        </div>
        <div className="com_waterfall_item_text_job">{data.job}</div>
      </div>
      <div className="com_waterfall_item_bio">{data.bio}</div>
    </div>
  );
};

export { WaterFallListItem };
export default WaterFallListItem;

import minimasonry from "minimasonry";
import { Ref } from "react";

export interface UseMasonryAction {
  layout: () => void;
  destroy: () => void;
}

/** masonry初始化帮手 */
export function useMasonry<Ele = HTMLElement>(): [Ref<Ele>, UseMasonryAction] {
  /** masonry实例 */
  const instance = useRef<any>(null);
  /** 挂载元素 */
  const containerRef = useRef<Ele>(null);

  /** 自动初始化 */
  useEffect(() => {
    const { current: container } = containerRef;
    if (container) {
      instance.current = new minimasonry({
        container: container,
        surroundingGutter: false,
        gutter: 15,
      });

      return () => {
        instance.current.destroy();
      };
    }
  }, []);

  const actions: UseMasonryAction = {
    layout: () => instance.current?.layout(),
    destroy: () => instance.current?.destroy(),
  };

  return [containerRef, actions];
}

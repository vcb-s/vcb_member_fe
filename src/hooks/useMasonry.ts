import minimasonry from "minimasonry";
import { Ref } from "react";

export interface UseMasonryAction {
  layout: () => void;
  destroy: () => void;
}

/** masonry初始化帮手 */
export function useMasonry<Ele = HTMLElement>(): [Ref<Ele>, UseMasonryAction] {
  /** masonry实例 */
  const instanceRef = useRef<any>(null);
  /** 挂载元素 */
  const containerRef = useRef<Ele>(null);

  const layout = useCallback(() => {
    let { current: instance } = instanceRef;
    if (!instance) {
      const { current: container } = containerRef;
      if (container) {
        instance = new minimasonry({
          container: container,
          surroundingGutter: false,
          gutter: 10,
        });

        instanceRef.current = instance;
      }
    }

    instance.layout();
  }, []);

  const destroy = useCallback(() => {
    instanceRef.current?.destroy();
  }, []);

  useEffect(() => {
    return destroy();
  }, [destroy]);

  const actions: UseMasonryAction = { layout, destroy };

  return [containerRef, actions];
}

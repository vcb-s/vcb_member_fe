import { useQuery } from "@/hooks/useQuery";
import WaterFall from "@/components/waterfall";
import Footer from "@/components/footer/async";
import Loading from "@/components/loading";
import GroupSelect from "@/components/biz/GroupSelect";

import "./index.scss";
import { Empty } from "@/components/Empty";
import { useCardStore } from "./store/card";

type PageParam = {
  group?: string;
};

function useParamsGroup(): number {
  const group = useQuery<PageParam>().group;

  if (group) {
    return +group;
  }

  return 1;
}

export default memo(() => {
  const history = useHistory();
  const group = useParamsGroup();
  const [loading, setLoading] = useState(false);
  const cardList = useCardStore(useCallback((s) => s.cards[group]?.res ?? [], [group]));
  const fetch = useCardStore(useCallback((s) => s.fetch, []));

  /** 自动加载 */
  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(group).finally(() => {
      active && setLoading(() => false);
    });

    return () => {
      active = false;
    };
  }, [fetch, group]);

  const onChange = useCallback(
    (nextGroup: number) => {
      history.replace({
        ...history.location,
        search: stringify({ group: nextGroup }),
      });
    },
    [history]
  );

  return (
    <div className="modules_member_index">
      <div className="modules_member_index_title">VCB-Studio 组员风采</div>

      <Suspense fallback={<Empty />}>
        <GroupSelect current={group} onChange={onChange} />

        <div style={{ height: "20px" }} />

        <Loading show={loading} />

        <WaterFall data={cardList} />

        <Footer />
      </Suspense>
    </div>
  );
});

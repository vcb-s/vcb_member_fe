import { useQuery } from "@/hooks/useQuery";
import WaterFall from "@/components/waterfall";
import Footer from "@/components/footer/async";
import Loading from "@/components/loading";
import GroupSelect from "@/components/group_select";
import { useCards } from "@/utils/services";

import "./index.scss";
import { Empty } from "@/components/Empty";

type PageParam = {
  group?: string;
};

function useParamsGroup(): number | undefined {
  const group = useQuery<PageParam>().group;

  if (group) {
    return +group;
  }

  return undefined;
}

export default memo(() => {
  const history = useHistory();
  const group = useParamsGroup();
  const [cardList, , loading] = useCards({ group });

  const onChange = useCallback(
    (nextGroup: number) => {
      history.replace({
        ...history.location,
        search: stringify({ group: nextGroup }),
      });
    },
    [history]
  );

  useEffect(() => {
    if (!group) {
      onChange(1);
    }
  }, [onChange, group]);

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

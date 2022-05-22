import { useHistory, useLocation } from "umi";
import { stringify } from "querystring";

import WaterFall from "@/components/waterfall/async";
import Footer from "@/components/footer/async";
import Loading from "@/components/loading";
import GroupSelect from "@/components/group_select/async";
import { useCards } from "@/utils/services";

import "./index.scss";

type PageParam = {
  group?: string;
};

export default memo(function IndexPage() {
  const history = useHistory();
  const location = useLocation();
  // @ts-ignore
  const params: PageParam = location.query;

  const navToGroup = useCallback(
    (groupID: string) => {
      history.push({
        pathname: history.location.pathname,
        search: stringify({
          ...params,
          group: groupID,
        }),
      });
    },
    [history, params]
  );

  useEffect(() => {
    if (!params.group) {
      navToGroup("1");
    }
  }, [navToGroup, params.group]);

  const [cardList, , loading] = useCards({ group: params.group || "" });

  return (
    <div className="modules_member_index">
      <div className="modules_member_index_title">VCB-Studio 社员一览</div>

      <Loading show={loading} />

      <GroupSelect current={params.group || ""} onChange={navToGroup} />

      <div style={{ height: "20px" }} />

      <WaterFall data={cardList} />
      <Footer />
    </div>
  );
});

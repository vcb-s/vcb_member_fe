import Loadable from "react-loadable";

import { Null } from "@/components/Null";

export default Loadable({
  loader: () => import(".").then((res) => res.WaterFall).catch(() => Null),
  loading: Null,
});

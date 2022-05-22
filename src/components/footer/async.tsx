import Loadable from "react-loadable";

import { Null } from "@/components/Null";

export default Loadable({
  loader: () => import(".").catch(() => Null),
  loading: Null,
});

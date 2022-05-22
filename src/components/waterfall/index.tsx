import Loadable from "react-loadable";

import { Null } from "@/components/Null";

export default Loadable({
  loader: () => import("./main").then((res) => res.default).catch(() => Null),
  loading: Null,
});

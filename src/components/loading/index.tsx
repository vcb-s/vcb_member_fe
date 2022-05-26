import { FunctionComponent } from "react";

import loadingIcon from "@/assets/loading.svg";
import "./index.scss";

interface Props {
  show?: boolean;
  className?: string;
}
const Loading: FunctionComponent<Props> = ({ show = true, className, ...rest }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={classnames("com_loadingWrap", className)} {...rest}>
      <img className="com_loading" src={loadingIcon} alt="" />
    </div>
  );
};

export default memo(Loading);

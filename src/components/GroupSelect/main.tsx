import { Chip } from "@material-ui/core";
import { Group } from "@/utils/types/Group";
import { useGroup } from "@/utils/services";

import styles from "./index.scss";

interface Props {
  current: Group.Item["id"] | undefined;
  onChange: (id: Group.Item["id"]) => void;
}
export default memo(function GroupSelect({ current, onChange }: Props) {
  const [groups] = useGroup();

  return (
    <>
      <div className={styles.groupSelectorWrap}>
        {groups.map((g) => (
          <Chip
            key={g.key}
            label={g.name}
            size="small"
            className={styles.groupSelectItem}
            data-id-type={typeof g.id === typeof current}
            data-color={current === g.id ? "primary" : "default"}
            color={current === g.id ? "primary" : "default"}
            onClick={() => onChange(g.id)}
          />
        ))}
      </div>
    </>
  );
});

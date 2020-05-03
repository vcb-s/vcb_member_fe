import React, { memo } from 'react';

import { Group } from '@/utils/types/Group';
import { Menu } from '@/components/Menu';
import { useGroup } from '@/utils/services';

import styles from './index.scss';

interface Props {
  current: Group.Item['id'];
  onChange: (id: Group.Item['id']) => void;
}
const GroupSelect: React.FC<Props> = memo(function GroupSelect({
  current,
  onChange,
}) {
  const [groups, error, loading] = useGroup();

  return (
    <div className={styles.com_groupSelectWrap}>
      <Menu
        loading={loading}
        onChange={onChange}
        groupItems={groups}
        selected={current}
      />
    </div>
  );
});

export default GroupSelect;

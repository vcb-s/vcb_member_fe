import React, { memo } from 'react';

import { Group } from '@/utils/types/Group';
import { Menu } from '@/components/Menu';

import styles from './index.scss';

interface Props {
  loading: boolean;
  data: Group.List;
  current: Group.Item['id'];
  onChange: (id: Group.Item['id']) => void;
}
const GroupSelect: React.FC<Props> = memo(function GroupSelect({
  loading,
  data,
  current,
  onChange,
}) {
  return (
    <div className={styles.com_groupSelectWrap}>
      <Menu
        loading={loading}
        onChange={onChange}
        groupItems={data.data}
        selected={current}
      />
    </div>
  );
});

export default GroupSelect;

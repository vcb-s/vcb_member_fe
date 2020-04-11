import React, { useMemo, useCallback } from 'react';
import Select, { Option } from '@material/react-select';

import { Group } from '@/utils/types/Group';

import '@material/react-list/index.scss';
import '@material/react-menu-surface/index.scss';
import '@material/react-menu/index.scss';
import '@material/react-select/index.scss';

interface Props {
  loading: boolean;
  selected: Group.Item['id'];
  groupItems: Group.Item[];
  onChange: (item: Group.Item['id']) => void;
}

export const Menu: React.FC<Props> = React.memo(function Button(props) {
  const { loading, selected, groupItems, onChange } = props;

  const selectLabel = useMemo(() => {
    if (loading) {
      return '加载中';
    }
    return '组别';
  }, [loading]);

  const changeHandle = useCallback(
    (index, item) => onChange(item.getAttribute('data-value')),
    [onChange],
  );

  return (
    <Select
      enhanced
      outlined
      label={selectLabel}
      value={selected}
      onEnhancedChange={changeHandle}
    >
      {groupItems.map((group) => (
        <Option key={group.key} value={group.id}>
          {group.name}
        </Option>
      ))}
    </Select>
  );
});

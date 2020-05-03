import React, { useMemo, useCallback, useState } from 'react';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import type { Group } from '@/utils/types/Group';

import styles from './index.scss';

interface Props {
  loading: boolean;
  selected: Group.Item['id'];
  groupItems: Group.Item[];
  onChange: (item: Group.Item['id']) => void;
}

export const Menu: React.FC<Props> = React.memo(function Menu(props) {
  const { loading, selected, groupItems, onChange } = props;

  const selectLabel = useMemo(() => {
    if (loading) {
      return '加载中';
    }
    return '组别';
  }, [loading]);

  const changeHandle = useCallback(
    (evt: React.ChangeEvent<{ name?: string; value: unknown }>) =>
      onChange(`${evt.target.value}`),
    [onChange],
  );

  return (
    <FormControl variant='outlined' className={styles.minWidthSelector}>
      <InputLabel>{selectLabel}</InputLabel>
      <Select
        value={loading ? '' : selected}
        onChange={changeHandle}
        label='组别'
      >
        {groupItems.map((group) => (
          <MenuItem key={group.key} value={group.id}>
            {group.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

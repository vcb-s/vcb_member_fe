import React, {
  FunctionComponent,
  memo,
  useCallback,
  useMemo,
  NamedExoticComponent,
} from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { Group } from '@/utils/types/Group';

import './index.scss';

interface Props {
  loading: boolean;
  data: Group.List;
  current: Group.Item['id'];
  onChange: (id: Group.Item['id']) => void;
}
const GroupSelect: FunctionComponent<Props> = ({
  loading,
  data,
  current,
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleSelect = useCallback(
    (next: Group.Item['id']) => {
      if (next !== current) {
        onChange(next);
      }
      handleClose();
    },
    [current, handleClose, onChange],
  );

  const btnLabel = useMemo(() => {
    if (loading) {
      return '加载中...';
    }

    if (!data.data.length) {
      return '未加载到数据';
    }

    for (const group of data.data) {
      if (group.id === current) {
        return `${group.name}组`;
      }
    }

    // 设计上不会走到这里
    return '请选择组别';
  }, [loading, data.data, current]);

  return (
    <div className='com_groupSelectWrap'>
      <Button
        onClick={handleClick}
        title='切换组别'
        endIcon={<ExpandMoreIcon />}
      >
        {btnLabel}
      </Button>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {data.data.map((group) => (
          <MenuItemWithID
            selected={current === group.id}
            group={group}
            key={group.key}
            onClick={handleSelect}
          />
        ))}
      </Menu>
    </div>
  );
};

interface MenuItemWithIDProps {
  selected: boolean;
  group: Group.Item;
  onClick: (id: Group.Item['id']) => void;
}
/**
 * 菜单项抽象组件
 *
 * @description
 *
 * 因为@material-ui会注入ref，FC组件不能注入这个属性的，所以只能切换为class实现
 **/
class MenuItemWithID extends React.PureComponent<MenuItemWithIDProps> {
  private clickHandle = () => {
    const { group, onClick } = this.props;

    onClick(group.id);
  };

  public render() {
    const { group, selected } = this.props;
    return (
      <MenuItem selected={selected} key={group.key} onClick={this.clickHandle}>
        {group.name}组
      </MenuItem>
    );
  }
}

export default memo(GroupSelect);

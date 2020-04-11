import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import WaterFall from '@/components/waterfall/async';
import Footer from '@/components/footer/async';
import Loading from '@/components/loading';
import GroupSelect from '@/components/group_select/async';
import { Group } from '@/utils/types/Group';

import { AppModels } from '@/models/app';

import './index.scss';

export default React.memo(function IndexPage() {
  const pageState = useSelector(AppModels.currentState);
  const loading: boolean = useSelector(
    (_: any) => _.loading.models[AppModels.namespace],
  );

  const dispatch = useDispatch();
  const { users, group, currentGroup } = pageState;

  useEffect(() => {
    dispatch(
      AppModels.createAction(AppModels.ActionType.getUserlist)({
        groupID: '1',
      }),
    );
  }, [dispatch]);

  const groupChangeHandle = useCallback(
    (groupID: Group.Item['id']) => {
      dispatch(
        AppModels.createAction(AppModels.ActionType.changeGroup)({ groupID }),
      );
    },
    [dispatch],
  );

  const maxLengthOfData = useMemo(() => {
    let maxLength = 0;
    Object.keys(users).forEach((group) => {
      maxLength = Math.max(users[group]?.data.length || 0, maxLength);
    });

    return maxLength;
  }, [users]);

  const cardList = useMemo(() => {
    return users[currentGroup]?.data || [];
  }, [currentGroup, users]);

  return (
    <div className='modules_member_index'>
      <div className='modules_member_index_title'>VCB-Studio 社员一览</div>

      <Loading show={loading && !maxLengthOfData} />

      <GroupSelect
        loading={loading}
        data={group}
        current={currentGroup}
        onChange={groupChangeHandle}
      />

      <div style={{ height: '20px' }} />

      <WaterFall data={cardList} />
      <Footer />
    </div>
  );
});

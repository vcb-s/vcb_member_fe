import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import WaterFall from '@/components/waterfall/async';
import Footer from '@/components/footer/async';
import Loading from '@/components/loading';
import GroupSelect from '@/components/group_select';
import { Group } from '@/utils/types/Group';

import { AppModels } from '@/models/app';

import './index.scss';

export default React.memo(function IndexPage() {
  const pageState: AppModels.State = useSelector(AppModels.currentState);
  const loading: boolean = useSelector(
    (_: any) => _.loading.models[AppModels.namespace],
  );

  const dispatch = useDispatch();
  const { users, group, currentGroup } = pageState;

  useEffect(() => {
    dispatch(
      AppModels.createAction(AppModels.ActionType.getUserlist)({
        page: 1,
      }),
    );
  }, [dispatch]);

  const groupChangeHandle = useCallback(
    (groupID: Group.Item['id']) => {
      dispatch(
        AppModels.createAction(AppModels.ActionType.getUserlist)({
          page: 1,
          groupID,
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className='modules_member_index'>
      <div className='modules_member_index_title'>VCB-Studio 社员一览</div>

      <Loading show={loading && !users.data.length} />

      <GroupSelect
        loading={loading}
        data={group}
        current={currentGroup}
        onChange={groupChangeHandle}
      />

      <div style={{ height: '20px' }} />

      <WaterFall data={users.data} />
      <Footer />
    </div>
  );
});

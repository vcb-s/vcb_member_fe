import React, { useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import WaterFall from '~/components/waterfall/async'
import Footer from '~/components/footer/async'
import Loading from '~/components/loading'
import GroupSelect from '~/components/group_select'
import { Group } from '~/utils/types'

import { slice as globalSlice, State as GlobalState, Actions as GlobalActions, sagas as GlobalSagas } from '~/models/app'

import './index.scss'

export default React.memo(function IndexPage () {
  const pageState: GlobalState = useSelector(_ => _[globalSlice.name])
  const dispatch = useDispatch()
  const { users, group, currentGroup } = pageState

  useEffect(() => {
    GlobalSagas(GlobalActions.getUserlist.fetch({ page: 1 }))
  }, [])

  const groupChangeHandle = useCallback((groupID: Group.Item['id']) => {
    GlobalSagas(GlobalActions.getUserlist.fetch({ page: 1, groupID }))
  }, [dispatch])

  return (
    <div className='modules_member_index'>
      <div className='modules_member_index_title'>VCB-Studio 社员一览</div>

      <Loading show={users.loading} />

      <GroupSelect data={group} current={currentGroup} onChange={groupChangeHandle} />

      <div style={{ height: '20px' }} />

      <WaterFall data={users.data} />
      <Footer />
    </div>
  )
})

import React from 'react'
import { useSelector } from 'react-redux'

import WaterFall from '~/components/waterfall/async'
import Footer from '~/components/footer/async'
// import GroupSwitcher from '~/components/group_switcher/async'

import { slice as globalSlice, State as GlobalState } from '~/models/app'

import loadingIcon from '~/assets/loading.svg'

import './index.scss'

export default React.memo(function IndexPage () {
  const pageState: GlobalState = useSelector(_ => _[globalSlice.name])
  const { users } = pageState

  return (
    <div className='modules_member_index'>
      <div className='modules_member_index_title'>VCB-Studio 社员一览</div>
      <WaterFall data={users.data} />
      <Footer hide={users.loading} />
      {/* {group.length ? <GroupSwitcher menuItem={group} onChange={groupChangeHandle} /> : null} */}
    </div>
  )
})

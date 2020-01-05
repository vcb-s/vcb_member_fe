import React, { FC, NamedExoticComponent } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import slice, { Actions, State, ToastItem, AlertItem } from '~/models/dialog'
import { Toast } from './toast'
import { Alert } from './alert'

interface Props { }
const Dialogs: NamedExoticComponent<Props> = React.memo(props => {
  const state: State = useSelector(state => state[slice.name])
  const dispatch = useDispatch()

  const handleClose = React.useCallback((id: ToastItem['id']) => {
    dispatch(Actions.Toast.hide({ id }))
  }, [dispatch])

  const handleAlertClose = React.useCallback((id: AlertItem['id']) => {
    dispatch(Actions.Alert.hide({ id }))
  }, [dispatch])

  return (
    <>
    {
      state.toast.map(toast => <Toast key={toast.key} data={toast} onClose={handleClose} />)
    }
    {
      state.alert.map(alert => <Alert key={alert.key} data={alert} onClose={handleAlertClose} />)
    }
    </>
  )
})

export { Dialogs }
export default Dialogs

import React, { NamedExoticComponent } from 'react'
import Snackbar, { SnackbarProps } from '@material-ui/core/Snackbar'

import { ToastItem } from '~/models/dialog'

const anchorOrigin: SnackbarProps['anchorOrigin'] = { vertical: 'top', horizontal: 'right' }

interface Props {
  data: ToastItem
  onClose: (id: ToastItem['id']) => void
}
const Toast: NamedExoticComponent<Props> = React.memo(props => {
  const { data, onClose } = props
  const handleClose = React.useCallback(() => {
    onClose(data.id)
  }, [data, onClose])

  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      key={data.key}
      open={!!data.content}
      onClose={handleClose}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={<span id="message-id">I love snacks</span>}
    />
  )
})

export { Toast }
export default Toast

import React, { NamedExoticComponent } from 'react';
import Snackbar, { SnackbarProps } from '@material-ui/core/Snackbar';

import { DialogModel } from '@/models/dialog';

const anchorOrigin: SnackbarProps['anchorOrigin'] = {
  vertical: 'top',
  horizontal: 'right',
};

interface Props {
  data: DialogModel.ToastItem;
  onClose: (id: DialogModel.ToastItem['id']) => void;
}
const Toast: NamedExoticComponent<Props> = React.memo((props) => {
  const { data, onClose } = props;
  const handleClose = React.useCallback(() => {
    onClose(data.id);
  }, [data, onClose]);

  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      key={data.key}
      open={!!data.content}
      onClose={handleClose}
      message={
        <span key={data.key} id={data.id}>
          {data.content}
        </span>
      }
    />
  );
});

export { Toast };
export default Toast;

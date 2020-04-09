import React, { NamedExoticComponent } from 'react';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { DialogModel } from '@/models/dialog';

// const anchorOrigin: DialogProps['onClose'] = { vertical: 'top', horizontal: 'right' }

interface Props {
  data: DialogModel.AlertItem;
  onClose: (id: DialogModel.AlertItem['id']) => void;
}
const Alert: NamedExoticComponent<Props> = React.memo((props) => {
  const { data, onClose } = props;
  const handleClose = React.useCallback(() => {
    onClose(data.id);
  }, [data, onClose]);

  return (
    <Dialog open={!!data.title} onClose={handleClose}>
      <DialogTitle id='alert-dialog-title'>{data.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {data.content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          确定
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export { Alert };
export default Alert;

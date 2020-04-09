import React, { FC, NamedExoticComponent } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { DialogModel } from '@/models/dialog';
import { Toast } from './toast';
import { Alert } from './alert';

interface Props {}
/** 本选择组件由root全局引入，不支持单独渲染引用 */
export const Dialogs: NamedExoticComponent<Props> = React.memo(
  function Dialogs() {
    const state: DialogModel.State = useSelector(DialogModel.currentState);
    const dispatch = useDispatch();

    const handleClose = React.useCallback(
      (id: DialogModel.ToastItem['id']) => {
        dispatch(
          DialogModel.createAction(DialogModel.ActionType.hideToast)({ id }),
        );
      },
      [dispatch],
    );

    const handleAlertClose = React.useCallback(
      (id: DialogModel.AlertItem['id']) => {
        dispatch(
          DialogModel.createAction(DialogModel.ActionType.hideAlert)({ id }),
        );
      },
      [dispatch],
    );

    return (
      <>
        {state.toast.map((toast) => (
          <Toast key={toast.key} data={toast} onClose={handleClose} />
        ))}
        {state.alert.map((alert) => (
          <Alert key={alert.key} data={alert} onClose={handleAlertClose} />
        ))}
      </>
    );
  },
);

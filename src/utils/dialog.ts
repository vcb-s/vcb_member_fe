import ID from '@/utils/union_id';
import { getDvaApp } from 'umi';
import { DialogModel } from '@/models/dialog';

export interface AlertParam {
  title?: string;
  content: string;
}
export const model = {
  show: (opt: AlertParam | Error) => {
    const { _store: store } = getDvaApp() || {};
    if (!store) {
      return;
    }
    const id = `${ID()}`;
    if (opt instanceof Error) {
      store.dispatch(
        DialogModel.createAction(DialogModel.ActionType.showAlert)({
          id,
          title: '提示',
          content: opt.message,
        }),
      );
    } else {
      const { title = '提示', content } = opt;
      store.dispatch(
        DialogModel.createAction(DialogModel.ActionType.showAlert)({
          id,
          title,
          content,
        }),
      );
    }
  },
  hide: (id?: string) => {
    const { _store: store } = getDvaApp() || {};
    if (!store) {
      return;
    }
    store.dispatch(
      DialogModel.createAction(DialogModel.ActionType.hideAlert)({ id }),
    );
  },
};

export interface ToastParam {
  content: string;
  time?: number;
}
export const toast = {
  show: (opt: ToastParam) => {
    const { _store: store } = getDvaApp() || {};
    if (!store) {
      return;
    }

    const { content, time = 1500 } = opt;
    const id = setTimeout(() => {
      store.dispatch(
        DialogModel.createAction(DialogModel.ActionType.hideToast)({ id }),
      );
    }, time).toString();
    store.dispatch(
      DialogModel.createAction(DialogModel.ActionType.showToast)({
        id,
        content,
      }),
    );
  },
  hide: (id?: string) => {
    const { _store: store } = getDvaApp() || {};
    if (!store) {
      return;
    }
    store.dispatch(
      DialogModel.createAction(DialogModel.ActionType.hideToast)({ id }),
    );
  },
};

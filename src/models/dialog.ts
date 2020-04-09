import type { Action, Reducer } from '@/utils/types';

export namespace DialogModel {
  export const namespace = '@@dialog';
  export const currentState = (_: any): State => _[namespace];

  export enum ActionType {
    showAlert = 'showAlert',
    hideAlert = 'hideAlert',
    showToast = 'showToast',
    hideToast = 'hideToast',
  }
  export interface Payload {
    [ActionType.showAlert]: { id: string; title: string; content: string };
    [ActionType.hideAlert]: { id?: string };
    [ActionType.showToast]: { id: string; content: string };
    [ActionType.hideToast]: { id?: string };
  }

  export const createAction = <K extends keyof Payload>(key: K) => {
    return (payload: Payload[K]) => {
      return { type: `${namespace}/${key}`, payload: payload };
    };
  };

  export interface AlertItem {
    key: string;
    id: string;
    title: string;
    content: string;
  }

  export interface ToastItem {
    key: string;
    id: string;
    content: string;
  }

  export interface State {
    alert: AlertItem[];
    toast: ToastItem[];
  }
}

const { namespace } = DialogModel;

interface Payload extends DialogModel.Payload {}
interface State extends DialogModel.State {}

const initalState: State = {
  alert: [],
  toast: [],
};

// const createAction = <K extends keyof Payload>(key: K) => {
//   return (payload: Payload[K]) => {
//     return { type: key, payload: payload };
//   };
// };

const reducers: Partial<Record<DialogModel.ActionType, Reducer<State>>> = {
  [DialogModel.ActionType.showAlert](
    state,
    { payload }: Action<Payload[DialogModel.ActionType.showAlert]>,
  ) {
    state.alert.push({
      key: payload.id,
      id: payload.id,
      title: payload.title,
      content: payload.content,
    });
  },
  [DialogModel.ActionType.hideAlert](
    state,
    { payload }: Action<Payload[DialogModel.ActionType.hideAlert]>,
  ) {
    if (payload.id) {
      state.alert = state.alert.filter((toast) => toast.id !== payload.id);
    } else {
      state.alert = [];
    }
  },
  [DialogModel.ActionType.showToast](
    state,
    { payload }: Action<Payload[DialogModel.ActionType.showToast]>,
  ) {
    state.toast.push({
      key: payload.id,
      id: payload.id,
      content: payload.content,
    });
  },
  [DialogModel.ActionType.hideToast](
    state,
    { payload }: Action<Payload[DialogModel.ActionType.hideToast]>,
  ) {
    if (payload.id) {
      state.toast = state.toast.filter((toast) => toast.id !== payload.id);
    } else {
      state.toast = [];
    }
  },
};

export default {
  namespace,
  state: initalState,
  effects: {},
  reducers,
};

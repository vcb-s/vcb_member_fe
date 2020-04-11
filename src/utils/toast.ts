import { toast as reactToastify } from 'react-toastify';

export const toast = {
  show: function (message: string) {
    reactToastify(message);
  },
  hide: function () {
    reactToastify.dismiss();
  },
};

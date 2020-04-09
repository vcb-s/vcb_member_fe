import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Dialogs } from '@/components/dialog';
import 'typeface-roboto';

import poyfill from '@/utils/asyncPoyfill';

export function render(oldRender: () => any) {
  poyfill().then(() => {
    oldRender();
  });
}

const Root: React.FC = function Root({ children }) {
  return (
    <>
      <CssBaseline />
      <Dialogs />
      {children}
    </>
  );
};

export function rootContainer(container: any) {
  return React.createElement(Root, null, container);
}

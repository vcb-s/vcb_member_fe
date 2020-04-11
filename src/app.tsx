import React from 'react';
import poyfill from '@/utils/asyncPoyfill';

export function render(oldRender: () => any) {
  poyfill().then(() => {
    oldRender();
  });
}
const Root: React.FC = function Root({ children }) {
  return <>{children}</>;
};

export function rootContainer(container: any) {
  return React.createElement(Root, null, container);
}

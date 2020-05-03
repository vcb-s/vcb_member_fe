import React, { useMemo } from 'react';
import { SWRConfig } from 'swr';
import type { ConfigInterface } from 'swr';
import { StylesProvider } from '@material-ui/core/styles';

import poyfill from '@/utils/asyncPoyfill';

export function render(oldRender: () => any) {
  poyfill().then(() => {
    oldRender();
  });
}
const Root: React.FC = function Root({ children }) {
  const swrConfig = useMemo((): ConfigInterface => {
    return {
      revalidateOnFocus: false,
    };
  }, []);
  return (
    <StylesProvider injectFirst>
      <SWRConfig value={swrConfig}>{children}</SWRConfig>
    </StylesProvider>
  );
};

export function rootContainer(container: any) {
  return React.createElement(Root, null, container);
}

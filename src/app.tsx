import React, { useMemo } from 'react';
import { SWRConfig } from 'swr';
import type { ConfigInterface } from 'swr';

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
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
};

export function rootContainer(container: any) {
  return React.createElement(Root, null, container);
}

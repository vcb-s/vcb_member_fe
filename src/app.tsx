import React, { useMemo } from 'react';
import { SWRConfig } from 'swr';
import type { ConfigInterface } from 'swr';

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

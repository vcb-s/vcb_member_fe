import { useLocation } from 'umi';
import React, { useEffect, useMemo } from 'react';

type PageParam = {
  IDS?: string;
};

/** 外链页面，布局与主页小页面模式一致 */
export default React.memo(function ExtenalPage() {
  const location = useLocation();
  // @ts-ignore
  const params: PageParam = location.query;
  /** 分割逗号、去重 */
  const ids = useMemo(() => [...new Set((params.IDS || '').split(','))], [
    params.IDS,
  ]);

  // hi28kmhfr4,hi28n4ds75,hi28jb1d6p,hhvah8ysci

  console.log('what is ids', ids);

  return <>hello</>;
});

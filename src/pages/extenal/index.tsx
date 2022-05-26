import { useQuery } from "@/hooks/useQuery";

type PageParam = {
  IDS?: string;
};

/** 外链页面，布局与主页小页面模式一致 */
export default memo(function ExtenalPage() {
  const query = useQuery<PageParam>();

  /** 分割逗号、去重 */
  const ids = useMemo(() => [...new Set((query.IDS || "").split(","))], [query.IDS]);

  // hi28kmhfr4,hi28n4ds75,hi28jb1d6p,hhvah8ysci

  console.log("what is ids", ids);

  return <>hello</>;
});

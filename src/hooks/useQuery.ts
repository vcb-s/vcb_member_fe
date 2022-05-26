/** 获取解析好的路由query */
export function useQuery<PageParam extends Record<string, string>>(): PageParam {
  // @ts-expect-error umi使用了history-with-query，history的导出是带有query的
  return useLocation().query;
}

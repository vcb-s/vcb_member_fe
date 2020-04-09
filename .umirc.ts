import { defineConfig } from 'umi';
import fiber from 'fibers';

export default defineConfig({
  title: 'vcb-s成员介绍',
  base: '/vcbs_member/',
  publicPath: '/vcbs_member/',

  hash: true,
  dynamicImport: {},
  forkTSCheker: {},
  nodeModulesTransform: { type: 'none' },
  favicon: '/assets/favicon.ico',

  analyze: {
    analyzerMode: 'static',
    openAnalyzer: true,
  },

  proxy: {
    '/vcbs_member_api': {
      target: 'https://vcb-s.com',
      changeOrigin: true,
    },
  },

  dva: {
    immer: true,
    hmr: false,
  },

  sass: {
    sassOptions: {
      fiber,
    },
  },
});

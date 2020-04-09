import { defineConfig } from 'umi';
import fiber from 'fibers';

export default defineConfig({
  title: 'vcb-s成员介绍',
  publicPath: './',

  hash: true,
  dynamicImport: {},
  forkTSCheker: {},
  nodeModulesTransform: { type: 'none' },
  favicon: '/assets/favicon.ico',

  proxy: {
    '/vcbs_member_api': {
      target: 'https://vcb-s.com',
      changeOrigin: true,
    },
  },

  dva: {
    immer: true,
  },

  sass: {
    sassOptions: {
      fiber,
    },
  },
});

import { defineConfig } from 'umi';
import fiber from 'fibers';

const { PROXY_TARGET = 'https://vcb-s.com' } = process.env;

export default defineConfig({
  title: 'vcb-s成员介绍',
  base: '/vcbs_member/',
  publicPath: '/vcbs_member/',

  hash: true,
  dynamicImport: {},
  forkTSChecker: {},
  nodeModulesTransform: { type: 'none' },
  favicon: '/assets/favicon.ico',

  analyze: {
    analyzerMode: 'static',
    openAnalyzer: true,
  },

  proxy: {
    '/vcbs_member_api': {
      target: PROXY_TARGET,
      changeOrigin: true,
    },
  },

  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
    axios: 'window.axios',
    'whatwg-fetch': 'window.fetch',
  },

  scripts: [
    'https://cdn.staticfile.org/axios/0.19.2/axios.min.js',
    'https://cdn.staticfile.org/react/16.13.1/umd/react.production.min.js',
    'https://cdn.staticfile.org/react-dom/16.13.1/umd/react-dom.production.min.js',
  ],

  sass: {
    sassOptions: {
      fiber,
    },
  },
});

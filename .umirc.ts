import { defineConfig } from 'umi';
import fiber from 'fibers';
// import { writeFileSync } from 'fs';

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
    'masonry-layout': 'window.Masonry',
  },

  headScripts: [
    // flags=always
    'https://polyfill.alicdn.com/polyfill.min.js?flags=gated&features=URL%2CURLSearchParams%2Cfetch%2CMap%2CWeakMap%2CSet%2CWeakSet',
  ],

  scripts: [
    'https://cdn.staticfile.org/masonry/4.2.2/masonry.pkgd.min.js',
    'https://cdn.staticfile.org/axios/0.19.2/axios.min.js',

    'https://cdn.staticfile.org/react/16.13.1/umd/react.production.min.js',
    'https://cdn.staticfile.org/react-dom/16.13.1/umd/react-dom.production.min.js',
  ],

  sass: {
    sassOptions: {
      fiber,
    },
  },

  chainWebpack: (config) => {
    config.module
      .rule('js')
      .use('babel-loader')
      .tap((options) => {
        options.presets[0][1].env = {
          ...options.presets[0][1].env,
          exclude: [
            ...(options.presets[0][1].env.exclude || []),
            /web\.url/,
            'es.promise',
            'es.weak-set',
            'es.weak-map',
            'es.map',
            'es.set',
          ],
        };
        // console.log('===');
        // console.log(options.presets);
        // console.log('===');
        return options;
      });
    // writeFileSync('./config.js', config.toString());
    // process.exit(0);
    return config;
  },
});

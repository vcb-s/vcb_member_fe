import { defineConfig } from "umi";

const { PROXY_TARGET = "https://vcb-s.com" } = process.env;

const __DEV__ = process.env.NODE_ENV === "development";

export default defineConfig({
  title: "vcb-s成员介绍",
  base: "/vcbs_member/",

  hash: true,
  dynamicImport: {},
  favicon: "/assets/favicon.ico",

  analyze: {
    analyzerMode: "static",
    openAnalyzer: true,
  },

  proxy: {
    "/vcbs_member_api": {
      target: PROXY_TARGET,
      changeOrigin: true,
    },
  },

  headScripts: __DEV__
    ? []
    : [
        // flags=always
        "https://polyfill.alicdn.com/polyfill.min.js?flags=gated&features=AbortController%2CURL%2CURLSearchParams%2Cfetch%2CMap%2CWeakMap%2CSet%2CWeakSet",
      ],

  sass: {},
  terserOptions: {
    compress: {
      drop_console: true,
    },
  },

  /** @link https://umijs.org/config#targets */
  targets: __DEV__
    ? {
        chrome: 100,
        firefox: false,
        safari: false,
        edge: false,
        ios: false,
      }
    : {
        /** @link https://caniuse.com/es6-module-dynamic-import */
        chrome: 63,
        firefox: 67,
        safari: 11.1,
        edge: 79,
        ios: 11,
      },

  webpack5: {},

  chainWebpack: (config) => {
    return config;
  },
});

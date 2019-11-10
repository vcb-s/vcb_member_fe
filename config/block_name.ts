export default {
  plugin: {
    html: 'plugin-html',
    htmlIntegrity: 'plugin-htmlIntegrity',
    clean: 'plugin-clean',
    analysis: 'plugin-analysis',
  },
  loader: {
    babel: {
      require: require.resolve('babel-loader'),
      name: 'loader-babel'
    },
    typescript: {
      require: require.resolve('ts-loader'),
      name: 'loader-typescript'
    },
    html: {
      require: require.resolve('html-loader'),
      name: 'loader-html'
    },
    ejs: {
      require: require.resolve('ejs-plain-loader'),
      name: 'loader-ejs'
    },
  },
}

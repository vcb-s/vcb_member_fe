export default {
  plugin: {
    html: 'plugin-html',
    htmlIntegrity: 'plugin-htmlIntegrity',
    clean: 'plugin-clean',
    analysis: 'plugin-analysis',
  },
  loader: {
    postcss: {
      require: require.resolve('postcss-loader'),
      name: 'postcss-loader'
    },
    css: {
      require: require.resolve('css-loader'),
      name: 'css-loader'
    },
    style: {
      require: require.resolve('style-loader'),
      name: 'style-loader'
    },
    sass: {
      require: require.resolve('sass-loader'),
      name: 'sass-loader'
    },
    babel: {
      require: require.resolve('babel-loader'),
      name: 'babel-loader'
    },
    typescript: {
      require: require.resolve('ts-loader'),
      name: 'typescript-loader'
    },
    html: {
      require: require.resolve('html-loader'),
      name: 'html-loader'
    },
    ejs: {
      require: require.resolve('ejs-plain-loader'),
      name: 'ejs-loader'
    },
  },
}

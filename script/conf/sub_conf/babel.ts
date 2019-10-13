import * as ConfigCreator from 'webpack-chain'

export default function (config: ConfigCreator) {
  config
    .module.rule('babel')
    .test(/\.(js|mjs|jsx)$/)
      .exclude
        .add(/node_modules/)
        .end()
      .use('babel')
        .loader('babel-loader')
}

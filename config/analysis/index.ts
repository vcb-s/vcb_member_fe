import * as ConfigCreator from 'webpack-chain'

export default function (config: ConfigCreator) {
  config
    .module.rule('ts-loader')
    .test(/((?<!(\.d))\.ts|\.tsx)$/)
      .exclude
        .add(/node_modules/)
        .end()
      .use('babel')
        .loader('babel-loader')
}

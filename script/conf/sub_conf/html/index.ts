import * as ConfigCreator from 'webpack-chain'
import * as HTMLWebpackPlugin from 'html-webpack-plugin'
import HTMLResourceIntPlugin from 'webpack-subresource-integrity'

import envLoader from '../../../tools/envLoader'

const env = envLoader()
const { mode } = env

export default function (config: ConfigCreator) {
  config
  .module
    .rule('ejs')
    .test(/\.ejs$/)
      .use('ejs')
        .loader('ejs-loader')
        .end()
      .end()
    .end()
    .when(
      mode === 'production',
      config => {
        config
        .plugin('html-integrity')
        .use(HTMLResourceIntPlugin, [{
          hashFuncNames: ['sha256', 'sha384']
        }])
        .end()
      }
    )
    .plugin('html')
      .use(HTMLWebpackPlugin)
      .end()

}

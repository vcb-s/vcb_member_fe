import * as ConfigCreator from 'webpack-chain'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

export default function (config: ConfigCreator) {
  config
    .plugin('clean')
      .use(CleanWebpackPlugin)
}

import * as ConfigCreator from 'webpack-chain'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

import blockName from '../block_name'

export default function (config: ConfigCreator) {
  config
    .plugin(blockName.plugin.clean)
      .use(CleanWebpackPlugin)
}

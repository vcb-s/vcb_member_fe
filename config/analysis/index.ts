import * as ConfigCreator from 'webpack-chain'
import blockName from '../block_name'

export default function (config: ConfigCreator) {
  config
    .module.rule(blockName.plugin.analysis)
    /** @TODO */
}

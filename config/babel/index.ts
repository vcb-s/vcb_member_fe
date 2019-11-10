import * as ConfigCreator from 'webpack-chain'
import blockName from '../block_name'

export const option = {
  presets: [],
  plugins: [],
}

export default function (config: ConfigCreator) {
  config
    .module
    .rule(blockName.loader.babel.name)
      .test(/\.(js|mjs)$/)
        .exclude.add('node_modules').end()
        .use(blockName.loader.babel.name)
        .loader(blockName.loader.babel.require)
        .options(option)
      .end()
      .test(/\.(jsx)$/)
}

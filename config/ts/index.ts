import * as ConfigCreator from 'webpack-chain'

import blockName from '../block_name'
import { option } from '../babel'

export default function (config: ConfigCreator) {
  config
    .module.rule(blockName.loader.typescript.name)
    .test(/((?<!(\.d))\.ts|\.tsx)$/)
      .use(blockName.loader.typescript.name)
        .loader(blockName.loader.typescript.require)
      .end()
      .use(blockName.loader.babel.name)
        .loader(blockName.loader.babel.require)
        .options(option)
      .end()
}

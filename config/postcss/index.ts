import * as ConfigCreator from 'webpack-chain'

import blockName from '../block_name'
import { option as styleOption } from '../style'
import { option as cssOption } from '../css'


export const option = {
  plugins: []
}
export default function (config: ConfigCreator) {
  config
    .module.rule(blockName.loader.sass.name)
    .test(/\.s[ac]ss$/)
      .use(blockName.loader.style.name)
        .loader(blockName.loader.style.require)
        .options(styleOption)
      .end()
      .use(blockName.loader.css.name)
        .loader(blockName.loader.css.require)
        .options(cssOption)
      .end()
      .use(blockName.loader.postcss.name)
        .loader(blockName.loader.postcss.require)
        .options(option)
      .end()
}

import * as ConfigCreator from 'webpack-chain'
import postcssPxToViewport from 'postcss-px-to-viewport'

import blockName from '../block_name'
import { option as postcssOption } from '../postcss'
import { option as styleOption } from '../style'
import { option as cssOption } from '../css'


export const option = {
  sassOptions: {
    // package "fibers" is automatically inject in config if has install
    // fiber: false
  }
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
        .options(postcssOption)
      .end()
      .use(blockName.loader.sass.name)
        .loader(blockName.loader.sass.require)
        .options(option)
      .end()
}

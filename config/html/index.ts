import { resolve } from 'path'
import { statSync } from 'fs'
import * as ConfigCreator from 'webpack-chain'
import * as HTMLWebpackPlugin from 'html-webpack-plugin'
import HTMLResourceIntPlugin from 'webpack-subresource-integrity'


import envLoader, { ROOT } from '@/script/utils/envLoader'
import blockName from '../block_name'

const env = envLoader()
const { mode } = env

const fallbackTemplatePath = resolve(__dirname, './default.ejs')
const defaultTemplatePath = resolve(ROOT, './src/index.ejs')

export default function (config: ConfigCreator) {
  let templatePath = fallbackTemplatePath
  try {
    statSync(defaultTemplatePath)
    templatePath = defaultTemplatePath
  } catch (e) {
    templatePath = fallbackTemplatePath
  }

  config
  .module
    .rule(blockName.loader.ejs.name)
      .test(/\.ejs$/)
        .use(blockName.loader.html.name).loader(blockName.loader.html.require).end()
        .use(blockName.loader.ejs.name).loader(blockName.loader.ejs.require).end()
      .end()
    .end()
    .when(
      mode === 'production',
      config => {
        config
        .plugin(blockName.plugin.htmlIntegrity)
        .use(HTMLResourceIntPlugin, [{
          hashFuncNames: ['sha256', 'sha384']
        }])
        .end()
      }
    )
    .plugin(blockName.plugin.html)
      .use(HTMLWebpackPlugin, [
        {
          template: templatePath
        }
      ])
      .end()

}

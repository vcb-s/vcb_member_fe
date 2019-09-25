import { statSync } from 'fs'
import { resolve } from 'path'
import * as ConfigCreator from 'webpack-chain'

import envLoader,{ ROOT } from '../tools/envLoader'
import console from '../tools/console'
import loadersImport from './loaders'
import pluginsImport from './plugins'

const env = envLoader()
const { mode } = env

const config = new ConfigCreator()

config.mode(mode)

/** 入口 */
const preDefineEntryPath = [
  resolve(ROOT, './src/index.ts'),
  resolve(ROOT, './src/index.js'),
  // resolve(ROOT, './src/index.mjs'),
]
for (const filePath of preDefineEntryPath) {
  try {
    statSync(filePath)

    config.entry('index')
      .clear()
      .add(filePath)
      .end()
  } catch (e) {
    //
  }
}

/** 出口 */
if (mode === 'development') {
  config.output
    .path(resolve(ROOT, './dist'))
    .filename('[name].js')
    .end()
} else {
  config.output
    .path(resolve(ROOT, './dist'))
    .filename('[id].[hash:8].js')
    .end()
}

if (!config.entry('index').values().length) {
  console.log('缺少文件入口！可选文件入口为')
  preDefineEntryPath.forEach(console.log)
  throw new Error('break')
}

/** 添加loader */
loadersImport(config)
/** 添加plugin */
pluginsImport(config)

export default config.toConfig()

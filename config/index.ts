import { statSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import * as ConfigCreator from 'webpack-chain'

import envLoader, { ROOT } from '../script/utils/envLoader'
import console from '../script/utils/console'

import babelLoader from './babel'
import tsLoader from './ts'
import analysisPlugin from './analysis'
import cleanPlugin from './clean'
import htmlPlugin from './html'

const env = envLoader({ focus: true })
const { mode, dumpConfigOnly } = env

const config = new ConfigCreator()

config.mode(mode)

/** 入口 */
const preDefineEntryPath = [
  resolve(ROOT, './src/index.ts'),
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
analysisPlugin(config)
babelLoader(config)
cleanPlugin(config)
htmlPlugin(config)
tsLoader(config)

if (dumpConfigOnly) {
  console.log('dumping config file ...')
  writeFileSync(resolve(ROOT, './debugConfig.js'), config.toString(), { encoding: 'utf8' })
  console.log('end')
  process.exit(0)
}

console.log('what is env', JSON.stringify(env))

export default config.toConfig()

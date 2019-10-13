import * as ConfigCreator from 'webpack-chain'
import babelLoader from './babel'
import tsLoader from './ts'
import analysisPlugin from './analysis'
import cleanPlugin from './clean'
import htmlPlugin from './html'

/** 过一次所有设置 */
export default function (conig: ConfigCreator) {
  babelLoader(conig)
  tsLoader(conig)
  analysisPlugin(conig)
  cleanPlugin(conig)
  htmlPlugin(conig)
}

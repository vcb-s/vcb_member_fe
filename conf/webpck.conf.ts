import * as webpack from 'webpack'
import { resolve } from 'path'

const config: webpack.Configuration = {
  mode: 'development',

  entry: resolve('src/index.ts')
}

export default config
import * as WebpackDevServer from 'webpack-dev-server'

import envLoader from '@/script/utils/envLoader'

const env = envLoader()

const HOST = env.devServerHost || 'localhost'
const PORT = env.devServerPort || 8000

const serverConfig: WebpackDevServer.Configuration = {
  disableHostCheck: true,
  compress: true,
  hot: true,
  quiet: true,
  headers: {
    'access-control-allow-origin': '*',
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  historyApiFallback: false,
  overlay: false,
  host: HOST,
  port: PORT
}

export default serverConfig

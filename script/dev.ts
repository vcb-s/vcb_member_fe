// import webpack from 'webpack'
import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'

import webpackConf from '../conf/webpck.conf'

const HOST = 'localhost'

const compiler = webpack(webpackConf)
const serverConfig: WebpackDevServer.Configuration = {
  disableHostCheck: true,
  compress: true,
  clientLogLevel: 'none',
  hot: true,
  quiet: false,
  headers: {
    'access-control-allow-origin': '*',
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  historyApiFallback: false,
  overlay: false,
  host: HOST,
};
const server = new WebpackDevServer(compiler, serverConfig)
const PORT = 8000

server.listen(PORT, HOST, err => {
  if (err) {
    console.log(err)
    return
  }

  console.log(`host start at http://${HOST}:${PORT}`)
})

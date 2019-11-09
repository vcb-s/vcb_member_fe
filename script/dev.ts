import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'

import conf from '@/config'
import serverConfig from './utils/devServer'

const compiler = webpack(conf)
const server = new WebpackDevServer(compiler, serverConfig)

server.listen(serverConfig.port, serverConfig.host, err => {
  if (err) {
    console.log(err)
    return
  }

  console.log(`host start at http://${serverConfig.host}:${serverConfig.port}`)
})

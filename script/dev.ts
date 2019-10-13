import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import conf from '@local/script/conf'
import envLoader from './tools/envLoader'

const env = envLoader()

const HOST = env.HOST || 'localhost'

for (const envKey of Object.keys(env)) {
  process.env[envKey] = env[envKey]
}


const compiler = webpack(conf)
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

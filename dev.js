import webpack from 'webpack'
import webpackConf from './conf/webpck.conf'
import WebpackDevServer from 'webpack-dev-server'

const compiler = webpack(webpackConf)
const serverConfig = {
  disableHostCheck: true,
  compress: true,
  clientLogLevel: 'none',
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
const HOST = 'localhost'
server.listen(PORT, HOST, err => {
  if (err) {
    console.log(err);
    return;
  }
})

import webpack from 'webpack'
import webpackConf from './conf/webpck.conf.prod'

webpack({
  // Configuration Object
}, (err, stats) => { // Stats Object
  if (err || stats.hasErrors()) {
    // Handle errors here
  }
  // Done processing
});

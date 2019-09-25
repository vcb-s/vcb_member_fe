import * as webpack from 'webpack'
import webpackConf from '@local/script/conf/webpck.conf'

import console from './tools/console'

webpack(
  webpackConf,
  (err, stats) => {
    if (err) {
      // Handle errors here
      console.log(err.message)
    } else if (stats.hasErrors()) {
      stats.toJson().errors.forEach(err => {
        console.error(err)
      })
    } else {
      // Done processing
      console.log('success')
      console.log('-----------')
        stats.toJson().chunks
          .map(chunk => ({
            name: chunk.names,
            filename: chunk.files.join(','),
            size: chunk.size
          }))
          .forEach(chunk => console.log(JSON.stringify(chunk)))
      console.log('-----------')
    }
  })

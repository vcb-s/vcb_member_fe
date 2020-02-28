const rimraf = require('rimraf')

rimraf.sync('./dist/*', { glob: true })

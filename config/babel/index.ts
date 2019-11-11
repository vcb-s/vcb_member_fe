import * as ConfigCreator from 'webpack-chain'
import blockName from '../block_name'

export const option = {
  presets: [
    ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }],
    ['@babel/preset-react'],
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', { corejs: 3 }],
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    ['@babel/plugin-proposal-class-properties', { 'loose' : true }],
  ],
}

export default function (config: ConfigCreator) {
  config
    .module
    .rule(blockName.loader.babel.name)
      .test(/\.(js|mjs)$/)
        .exclude.add('node_modules').end()
        .use(blockName.loader.babel.name)
        .loader(blockName.loader.babel.require)
        .options(option)
      .end()
      .test(/\.(jsx)$/)
}

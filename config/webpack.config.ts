import webpack from 'webpack'
import { resolve } from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'

const __BASE__ = process.cwd()

// 移除这个env key，因为会影响接下来的 ts-load 和 tsconfig-paths-webpack-plugin
delete process.env['TS_NODE_PROJECT']

const { NODE_ENV } = process.env
const __DEV__ = NODE_ENV === 'development'

const __DIST__ = resolve(__BASE__, 'dist')

const browserslist = [
  'last 2 major versions',
  'not ie 6 - 11',
  'not ExplorerMobile 10 - 11',
  'not OperaMini all',
  'not OperaMobile < 100',
  'not baidu < 100',
  'not bb < 100',
  'not kaios < 100',
].join(',')

const loader = {
  ['css-extract']: MiniCssExtractPlugin.loader,
  ['css-loader']: require.resolve('css-loader'),
  ['postcss-loader']: require.resolve('postcss-loader'),
  ['sass-loader']: require.resolve('sass-loader'),

  ['babel-loader']: require.resolve('babel-loader'),
  ['ts-loader']: require.resolve('ts-loader'),

  ['html-loader']: require.resolve('html-loader'),
  ['file-loader']: require.resolve('file-loader'),
}

const loaderOptions = {
  ['css-extract']: {
    exclude: /node_modules/,
  },
  ['css-loader']: {
    url: true,
  },
  ['postcss-loader']: {
    plugins: (loader) => [
      require('cssnano')({
        merge: false
      }),
      require('autoprefixer')({
        "remove": false
      }),
      require("postcss-modules")({
        generateScopedName: '[hash:base64:6]',
        getJSON: () => {}
      })
    ]
  },
  ['sass-loader']: {
    sourceMap: true
  },

  ['babel-loader']: {
    "presets": [
      ["@babel/preset-env", {
        "useBuiltIns": "usage",
        "targets": browserslist,
        "corejs": 3,
        modules: 'commonjs',
      }],
      ["@babel/preset-react"]
    ],
    "plugins": [
      ["@babel/plugin-transform-runtime"],
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      ["@babel/plugin-proposal-class-properties", { "loose" : true }]
    ],
    babelrc: false,
    cacheDirectory: true,
  },
  ['ts-loader']: {
    transpileOnly: true,
    configFile: resolve(__BASE__, 'tsconfig.json')
  },

  ['html-loader']: {},
  ['file-loader']: {
    name: '[hash:8].[ext]',
    publicPath: '.',
  },
} as const

const styleLoaders: webpack.RuleSetUseItem[] = [
  {
    loader: __DEV__ ? '' : loader['css-extract'],
    options: loaderOptions['css-extract']
  },
  {
    loader: loader['css-loader'],
    options: loaderOptions['css-loader']
  },
  {
    loader: loader['postcss-loader'],
    options: loaderOptions['postcss-loader']
  },
].filter(_ => !!_['loader'])

export default async () => {
  const config: webpack.Configuration = {
    entry: {
      main: resolve(__BASE__, 'src/index')
    },

    mode: __DEV__ ? 'development' : 'production',

    target: 'web',

    cache: true,

    output: {
      hashDigest: 'base64',
      hashDigestLength: 8,
      /** 即使是在nodejs奇怪的效能下sha1也还是比md4快 */
      hashFunction: 'sha1',

      filename: '[name].[hash].js',
      chunkFilename: '[name].[chunkhash].js',

      path: __DIST__,
      publicPath: '.',
    },

    // devtool: 'source-map',

    module: {
      rules: [
        /** style */
        {
          test: /\.css$/i,
          exclude: /node_modules/,
          use: styleLoaders,
        },
        {
          test: /\.css$/i,
          include: /node_modules/,
          use: [
            {
              loader: loader['css-loader'],
              options: loaderOptions['css-loader'],
            }
          ],
        },
        {
          test: /\.(sa|sc)ss$/i,
          exclude: /node_modules/,
          use: [
            ...styleLoaders,
            {
              loader: loader['sass-loader'],
              options: loaderOptions['sass-loader']
            },
          ],
        },

        /** script */
        {
          test: /\.tsx?$/i,
          exclude: /node_modules/,
          use: [
            {
              loader: loader['babel-loader'],
              options: loaderOptions['babel-loader']
            },
            {
              loader: loader['ts-loader'],
              // options: loaderOptions['ts-loader']
            },
          ]
        },

        /** template */
        // {
        //   test: /\.html$/,
        //   use: [
        //     {
        //       loader: 'html-loader',
        //       options: {}
        //     }
        //   ],
        // },

        /** other file */
        {
          test: /\.(woff|woff2|svg|ttf|otf|png|jpg|webp|jpeg|gif|apng)$/,
          use: [
            {
              loader: loader['file-loader'],
              options: loaderOptions['file-loader']
            },
          ],
        },
      ]
    },

    resolve: {
      // symlinks: true,
      // alias: {
      //   '@': resolve(__BASE__, 'src')
      // },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: resolve(__BASE__, './tsconfig.json')
        })
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: resolve(__BASE__, 'src/index.html'),
        minify: {}
      }),
      new webpack.ProgressPlugin()
    ],
  }

  if (__DEV__) {
    //
  } else {
    config.plugins.push(new MiniCssExtractPlugin())

    config.optimization = {
      splitChunks: {
        chunks: 'async',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: Infinity,
        maxInitialRequests: Infinity,
        automaticNameDelimiter: '.',
        cacheGroups: {
          defaultVendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      },
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          terserOptions: {
            parse: {},
            ie8: false,
            safari10: true
          }
        })
      ],
    }
  }

  return config
}

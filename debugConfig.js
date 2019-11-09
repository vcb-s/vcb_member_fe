{
  mode: 'development',
  output: {
    path: 'D:\\vcb-member-fe\\dist',
    filename: '[name].js'
  },
  module: {
    rules: [
      /* config.module.rule('ts-loader') */
      {
        test: /((?<!(\.d))\.ts|\.tsx)$/,
        exclude: [
          /node_modules/,
          /node_modules/
        ],
        use: [
          /* config.module.rule('ts-loader').use('babel') */
          {
            loader: 'babel-loader'
          }
        ]
      },
      /* config.module.rule('babel') */
      {
        test: /\.(js|mjs|jsx)$/,
        exclude: [
          /node_modules/
        ],
        use: [
          /* config.module.rule('babel').use('babel') */
          {
            loader: 'babel-loader'
          }
        ]
      },
      /* config.module.rule('ejs') */
      {
        test: /\.ejs$/,
        use: [
          /* config.module.rule('ejs').use('ejs') */
          {
            loader: 'html-loader'
          },
          /* config.module.rule('ejs').use('plain-ejs') */
          {
            loader: 'ejs-plain-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    /* config.plugin('clean') */
    new CleanWebpackPlugin(),
    /* config.plugin('html') */
    new HtmlWebpackPlugin(
      {
        template: 'D:\\vcb-member-fe\\config\\html\\default.ejs'
      }
    )
  ],
  entry: {
    index: [
      'D:\\vcb-member-fe\\src\\index.ts'
    ]
  }
}
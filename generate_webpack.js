const path = require('path');
const webpack = require('webpack');
require('babel-loader');
require('css-loader');
require('style-loader');
require('./src/loaders/markdown-loader');

module.exports = (isDev) => ({
  devtool: isDev ? 'cheap-eval-source-map' : null,
  entry: isDev ?  [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    './src/index.js'
  ] : [
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: isDev ? [
    new webpack.HotModuleReplacementPlugin(),
  ] : [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false},
      output: {comments: false},
      sourceMap: false
    })
  ],
  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader?modules!less-loader'
      },
      {
        test: /\.md$/,
        loader: 'markdown'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.png$/,
        loader: 'file'
      }
    ]
  },
  resolveLoader: {
    fallback: [
      path.resolve(__dirname, 'src/loaders')
    ]
  },
  resolve: {
    root: [
      path.resolve('./'),
    ]
  }
});

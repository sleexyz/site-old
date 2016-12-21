const path = require('path');
const webpack = require('webpack');
require('babel-loader');
require('css-loader');
require('style-loader');
require('./src/loaders/markdown-loader');


module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
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
}

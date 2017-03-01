// @flow

const path = require('path');
const webpack = require('webpack');

/* :: type Mode = 'dev' | 'prod'; */

const impossible /* : empty => any */ = () => null;

module.exports = (mode /* : Mode */) => ({
  devtool: (() => {
    switch (mode) {
      case 'dev': return 'cheap-module-source-map';
      case 'prod': return undefined;
      default: return impossible(mode);
    }
  })(),
  entry: (() => {
    switch (mode) {
      case 'dev': return [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        path.resolve(__dirname, 'frontend/src/app/index.js'),
      ];
      case 'prod': return [
        path.resolve(__dirname, 'frontend/src/app/index.js'),
      ];
      default: return impossible(mode);
    }
  })(),
  output: {
    path: path.resolve(__dirname, 'dist', 'gen'),
    filename: 'bundle.js',
    publicPath: '/gen/',
  },
  plugins: (() => {
    switch (mode) {
      case 'dev': return [
        new webpack.HotModuleReplacementPlugin(),
      ];
      case 'prod': return [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production'),
          },
        }),
        new webpack.optimize.UglifyJsPlugin({
          compress: { warnings: false },
          output: { comments: false },
          sourceMap: false,
        }),
      ];
      default: return impossible(mode);
    }
  })(),
  module: {
    loaders: [
      {
        test: /\.md$/,
        use: [
          { loader: 'markdown-loader' },
        ],
      },
      {
        test: /\.js$/,
        use: [
          { loader: 'babel-loader' },
        ],
        include: path.resolve(__dirname, 'frontend', 'src'),
      },
      {
        test: /\.png$/,
        use: [
          { loader: 'file-loader' },
        ],
      },
    ],
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname, 'loaders', 'src'),
      'node_modules',
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'frontend', 'src'),
      'node_modules',
    ],
  },
});

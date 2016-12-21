const path = require('path');
const webpack = require('webpack');
const express = require('express');
const serveStatic = require('serve-static');
const config = require('./webpack.config');
const webpackDev = require('webpack-dev-middleware');
const webpackHot = require('webpack-hot-middleware');

const app = express();
const compiler = webpack(config);

app.use(webpackDev(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    assets: false,
    cached: false,
    children: false,
    chunkModules: false,
    chunks: false,
    colors: true,
    errors: true,
    hash: false,
    modules: false,
    timings: false,
    version: false,
  }
}));
app.use(webpackHot(compiler, {
  log: console.log
}));
app.use(serveStatic(path.join(__dirname, 'static')));
app.use('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'static/index.html'));
});
app.listen(3000, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Listenting at http://localhost:3000');
});

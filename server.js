#!/usr/bin/env node
/* eslint no-console: 0 */
const path = require('path');
const webpack = require('webpack');
const express = require('express');
const serveStatic = require('serve-static');
const config = require('./webpack.dev.config.js');
const webpackDev = require('webpack-dev-middleware');
const webpackHot = require('webpack-hot-middleware');

const port = 8080;

const compiler = webpack(config);

const app = express();
app.use(webpackDev(compiler, {
  publicPath: config.output.publicPath,
  stats: 'errors-only',
}));
app.use(webpackHot(compiler));
app.use(serveStatic(path.resolve(__dirname, 'dist/')));
app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});
app.listen(port, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Listenting at http://localhost:${port}`);
});

const express = require('express');

const webpackConfig = require('../../webpack.config');
const config = require('../config');

const router = express.Router();

const renderData = {
  appinsightsKey: config.appinsightsKey,
  isLoggedIn: true,
  name: 'John Doe',
};

if (config.dev) {
  // eslint-disable-next-line
  const webpack = require('webpack');
  // eslint-disable-next-line
  const webpackMiddleware = require('webpack-dev-middleware');
  // eslint-disable-next-line
  const webpackHotMiddleware = require('webpack-hot-middleware');

  const compiler = webpack(webpackConfig);
  const middleware = webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: 'client',
    noInfo: true,
  });

  router.use(middleware);
  router.use(webpackHotMiddleware(compiler));
  router.get('*', (req, res) => {
    res.render('index', renderData);
  });
} else {
  router.get('*', (req, res) => {
    res.render('index', renderData);
  });
}

module.exports = router;

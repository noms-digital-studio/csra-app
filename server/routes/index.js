const fs = require('fs');
const path = require('path');
const express = require('express');
const mustache = require('mustache');

const webpackConfig = require('../../webpack.config');

const config = require('../config');

const router = express.Router();

const renderData = {
  appinsightsKey: config.appinsightsKey,
};
const templatePath = path.join(__dirname, '../../public/dist/index.html');

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
    const template = middleware.fileSystem.readFileSync(templatePath, 'utf-8');
    const parsedTemplate = mustache.render(template, renderData);

    res.send(parsedTemplate);
  });
} else {
  const template = fs.readFileSync(templatePath, 'utf-8');
  const parsedTemplate = mustache.render(template, renderData);

  router.get('*', (req, res) => {
    res.send(parsedTemplate);
  });
}

module.exports = router;

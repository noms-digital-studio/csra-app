import fs from 'fs';
import path from 'path';
import express from 'express';
import mustache from 'mustache';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import webpackConfig from '../../webpack.config';

import config from '../config';

const router = express.Router();

const isDeveloping = config.env !== 'production';
const renderData = {
  appinsightsKey: config.appinsightsKey,
};
const templatePath = path.join(__dirname, '../../public/dist/index.html');

if (isDeveloping) {
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

export default router;

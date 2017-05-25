import fs from 'fs';
import path from 'path';
import express from 'express';
import mustache from 'mustache';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import webpackConfig from '../../webpack.config';

const router = express.Router();
const config = { APPINSIGHTS_INSTRUMENTATIONKEY: process.env.APPINSIGHTS_INSTRUMENTATIONKEY };

const isDeveloping = process.env.NODE_ENV !== 'production';

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
    const template = middleware.fileSystem.readFileSync(path.join(__dirname, '../../public/dist/index.html'), 'utf-8');
    const parsedTemplate = mustache.render(template, config);

    res.send(parsedTemplate);
  });
} else {
  const template = fs.readFileSync(path.join(__dirname, '../../public/dist/index.html'), 'utf-8');
  const parsedTemplate = mustache.render(template, config);

  router.get('*', (req, res) => {
    res.send(parsedTemplate);
  });
}

export default router;

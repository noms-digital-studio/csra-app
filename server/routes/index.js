import path from 'path';
import express from 'express';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import webpackConfig from '../../webpack.config';

const router = express.Router();

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
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '../../public/dist/index.html')));
    res.end();
  });
} else {
  router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/dist/index.html'));
  });
}

export default router;

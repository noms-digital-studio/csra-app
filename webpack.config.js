const path = require('path');

const webpack = require('webpack');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');

const dev = process.env.NODE_ENV !== 'production';

module.exports = {
  context: __dirname,
  entry: {
    main: [path.join(__dirname, 'client', 'javascript', 'main.jsx')].concat(
      dev ? ['webpack-hot-middleware/client'] : []
    ),
  },

  devtool: dev ?  'source-map': 'cheap-module-source-map',

  output: {
    path: path.join(__dirname, 'public', 'dist'),
    publicPath: '/dist',
    filename: 'main.bundle.js',
    sourceMapFilename: 'main.map',
  },

  module: {
    rules: [
      {
        test: /\.jsx|\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: dev ? ['env', 'react-hmre'] : ['env'],
        },
      },
    ],
  },

  plugins: [
    // Remove old artfacts on build
    new WebpackCleanupPlugin(),
    new webpack.NamedModulesPlugin(),
    dev && new webpack.NoEmitOnErrorsPlugin(),
    dev && new webpack.HotModuleReplacementPlugin(),
    // React uses this to do dead code elimination
    !dev &&
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
      }),

    !dev &&
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css|html)$/,
        threshold: 10240,
        minRatio: 0.8,
      }),

    // Minify code in production only
    !dev && new BabiliPlugin(),
  ].filter(Boolean),

  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
};

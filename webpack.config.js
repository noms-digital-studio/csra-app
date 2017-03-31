const path = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');

const precss = require('precss');
const autoprefixer = require('autoprefixer');

const dev = process.env.NODE_ENV !== 'production';

function extractInProduction(loader) {
  if (dev) {
    return ['style-loader'].concat(loader);
  }
  return ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: loader,
  });
}

module.exports = {
  context: __dirname,

  entry: {
    main: path.join(__dirname, 'client', 'main.jsx'),
  },

  devtool: dev ? 'cheap-module-source-map' : 'source-map',

  output: {
    path: path.join(__dirname, 'public', 'dist'),
    publicPath: '/',
    filename:'[name].bundle.js',
    sourceMapFilename: '[name].[hash].map',
  },

  module: {
    rules: [
      {
        test: /\.jsx|\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['env'],
        },
      },
      {
        test: /\.css$/,
        loader: extractInProduction([
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [precss, autoprefixer],
            },
          },
        ]),
      },
      {
        test: /\.scss/,
        loader: extractInProduction([
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: [
                path.join(__dirname, 'node_modules/govuk-elements-sass/public/sass'),
                path.join(__dirname, 'node_modules/govuk_frontend_toolkit/stylesheets'),
              ],
            },
          },
        ]),
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader?limit=10000',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader?limit=10000',
      },
    ],
  },

  plugins: [
    // Remove old artfacts on build
    new WebpackCleanupPlugin(),

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

    !dev &&
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: false,
    }),

    // CSS is moved into an external file for production
    !dev && new ExtractTextPlugin('[name].css'),

    // Minify code in production only
    !dev && new BabiliPlugin(),
  ].filter(Boolean),

  // Shim some things that enzyme requires when running in karma
  externals: dev
    ? {
      jsdom: 'window',
      cheerio: 'window',
      'react/lib/ExecutionEnvironment': true,
      'react/addons': true,
      'react/lib/ReactContext': 'window',
    }
    : {},

  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
};

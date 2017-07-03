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
    main: [path.join(__dirname, 'client', 'javascript', 'main.jsx')].concat(
      dev ? ['webpack-hot-middleware/client'] : []
    ),
  },

  devtool: dev ?  'source-map': 'cheap-module-source-map',

  output: {
    path: path.join(__dirname, 'public', 'dist'),
    publicPath: '/dist',
    filename: '[name].[hash].bundle.js',
    sourceMapFilename: '[name].[hash].map',
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
      {
        test: /\.css$/,
        use: extractInProduction([
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
        use: extractInProduction([
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: [
                path.join(
                  __dirname,
                  'node_modules/govuk-elements-sass/public/sass'
                ),
                path.join(
                  __dirname,
                  'node_modules/govuk_frontend_toolkit/stylesheets'
                ),
              ],
            },
          },
        ]),
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: 'url-loader?limit=10000',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: 'url-loader?limit=10000',
      },
    ],
  },

  plugins: [
    // Remove old artfacts on build
    new WebpackCleanupPlugin(),
    new webpack.NamedModulesPlugin(),
    dev && new webpack.NoEmitOnErrorsPlugin(),
    dev && new webpack.HotModuleReplacementPlugin(),

    new HtmlWebpackPlugin({
      inject: true,
      template: 'server/views/index.tmpl.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),

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
    !dev && new ExtractTextPlugin('[name].[hash].css'),

    // Minify code in production only
    !dev && new BabiliPlugin(),
  ].filter(Boolean),

  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
};

const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const workboxPlugin = require('workbox-webpack-plugin');
const WebpackBar = require('webpackbar');

const folder = 'production';

module.exports = {
  mode: 'production',

  entry: [
    './src/index.js',
    './style/main.scss',
  ],

  output: {
    path: path.join(__dirname, folder),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      { // sass / scss loader for webpack
        test: /\.(sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?url=false&minimize=true',
          'sass-loader',
        ],
      },
    ],
  },

  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
  },

  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new UglifyJsPlugin({
      parallel: true,
      cache: true,
    }),
    new WebpackBar(),
    new MiniCssExtractPlugin({ // define where to save the file
      filename: 'style.css',
      // allChunks: true,
    }),
    new workboxPlugin.GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      exclude: ['index.html'],
      skipWaiting: true,
      globDirectory: folder,
      runtimeCaching: [
        {
          urlPattern: new RegExp('^https://fonts.(?:googleapis|gstatic).com/(.*)'),
          handler: 'cacheFirst',
        },
        {
          urlPattern: new RegExp('images'),
          handler: 'cacheFirst',
        },
      ],
    }),
  ],
};

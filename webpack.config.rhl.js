const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    path.join(__dirname, 'src/index.js'),
    './style/main.scss',
  ],

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
    pathinfo: true,
  },

  devtool: 'eval-cheap-module-source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'happypack/loader?id=js',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        loader: 'happypack/loader?id=styles',
        exclude: /node_modules/,
      },
    ],
  },

  devServer: {
    host: 'localhost',
    https: true,
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    stats: {
      colors: true, // color is life
      errorDetails: true,
    },
  },

  plugins: [
    // new HardSourceWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HappyPack({
      id: 'js',
      threads: 4,
      loaders: [
        'babel-loader?cacheDirectory',
      ],
    }),
    new HappyPack({
      id: 'styles',
      threads: 4,
      loaders: [
        'cache-loader',
        'style-loader',
        'css-loader?sourceMap&-url',
        'sass-loader?sourceMap',
        'import-glob',
      ],
    }),
  ],

  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      path.join(__dirname, 'style'),
      'node_modules',
    ],
  },
};

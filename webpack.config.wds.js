const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    // devtoolModuleFilenameTemplate: '../[resource-path]',
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: 8888,
    historyApiFallback: true,
    proxy: {
      '/public': {
        target: 'http://localhost:8888',
        pathRewrite: {
          '^/public': '',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          cacheDirectory: true,
          presets: ['es2015', 'react'],
          plugins: ['transform-class-properties', 'transform-object-rest-spread'],
        },
      },
    ],
  },
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
  },
};

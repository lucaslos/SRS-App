const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const workboxPlugin = require('workbox-webpack-plugin');
// const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const folder = 'docs/Ym13IG1vYmlsaXR5IHByb2plY3Q=';

module.exports = {
  mode: 'production',

  entry: [
    './src/index.js',
    './style/main.scss',
  ],

  output: {
    path: path.join(__dirname, folder),
    filename: '[name].[contenthash:8].js',
    // publicPath: '/Ym13IGRhdGEgdml6dWFsaXphdGlvbg==/',
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

  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
    runtimeChunk: true,
  },

  plugins: [
    new CleanWebpackPlugin([
      `${folder}/main*.js`,
      `${folder}/*style*.css`,
      `${folder}/*runtime*.js`,
      `${folder}/npm*.js`,
      `${folder}/precache-manifest*.js`,
    ]),
    // new WebpackBar(),
    new MiniCssExtractPlugin({ // define where to save the file
      filename: 'style.[contenthash].css',
      // allChunks: true,
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: true,
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
    new workboxPlugin.GenerateSW({
      swDest: 'sw.js',
      // exclude: ['index.html'],
      clientsClaim: true,
      skipWaiting: true,
      importWorkboxFrom: 'cdn',
      globDirectory: folder,
      runtimeCaching: [
        {
          urlPattern: new RegExp('^https://use.typekit.net.com/(.*)'),
          handler: 'cacheFirst',
        },
        {
          urlPattern: new RegExp('^https://api.mapbox.com(.*)'),
          handler: 'cacheFirst',
        },
        {
          urlPattern: new RegExp('^https://tiles.mapbox.com/(.*)'),
          handler: 'cacheFirst',
          options: {
            cacheName: 'mapTiles',
            expiration: {
              maxEntries: 40,
            },
          },
        },
        {
          urlPattern: new RegExp('static'),
          handler: 'cacheFirst',
        },
      ],
    }),
  ],
};

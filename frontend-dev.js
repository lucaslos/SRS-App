const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');

const config = require('./webpack.config.rhl.js');

const options = {
  publicPath: config.output.publicPath,
  contentBase: './public',
  hot: true,
  host: 'localhost',
  historyApiFallback: true,
  stats: {
    colors: true, // color is life
    errorDetails: true,
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
  },

  before(app) {
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public/index.html'));
    });

    app.get('/style.css', (req, res) => {
      res.sendFile(path.join(__dirname, 'public/style.css'));
    });

    app.get('/bookmarklet.js', (req, res) => {
      res.sendFile(path.join(__dirname, 'public/bookmarklet.js'));
    });

    app.get('/section/*', (req, res) => {
      res.sendFile(path.join(__dirname, 'public/index.html'));
    });
  },
};

WebpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new WebpackDevServer(compiler, options);

server.listen(3000, '0.0.0.0', () => {
  console.log('dev server listening on port 3000');
});

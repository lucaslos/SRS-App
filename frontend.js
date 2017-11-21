const path = require('path');
const webpack = require('webpack');
const express = require('express');
const config = require('./webpack.config.rhl');

const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: {
    colors: true, // color is life
    errorDetails: true,
  },
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index2.html'));
});

app.get('/style.css', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/style.css'));
});

app.get('/bookmarklet.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/bookmarklet.js'));
});

app.get('/section/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index2.html'));
});

app.listen(3000, function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:3000/');
})

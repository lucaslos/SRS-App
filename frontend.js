const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index2.html'));
});

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/style.css'));
});

app.get('/bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/bundle.js'));
});

app.get('/section/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index2.html'));
});

app.listen(3000, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:3000/');
});

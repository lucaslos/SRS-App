const path = require('path');
const express = require('express');

// const router = express.Router();
// TODO: add html here

const app = express();

const staticPath = path.join(__dirname, 'production/');

// server latency
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

app.use(express.static(staticPath));

const port = 5050;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

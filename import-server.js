const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
var cors = require('cors')

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};


https.createServer(options, app).listen(8484);

app.use(cors());

app.get('/card', (req, res) => {
  res.sendFile('D:/Files/Google Drive/Backups/srs/db.json');
});

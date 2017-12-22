const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router('D:/Files/Google Drive/Backups/srs/db.json');
const middlewares = jsonServer.defaults({
  static: 'prodution',
});

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'production/index.html'));
});

server.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'production/style.css'));
});

server.get('/bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'production/bundle.js'));
});

server.get('/section/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'production/index.html'));
});

server.use('/api', router);

server.listen(4000, () => {
  console.log('JSON Server is running');
});

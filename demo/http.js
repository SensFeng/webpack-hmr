const express = require('express');
const http = require('http');

const app = express();
app.get('/', (req, res) => {
  res.send('hello world');
});
app.listen(9000, () => console.log('Example app listening on port 3000!'))

// const server = http.createServer(app);
// server.listen(9000, 'localhost', (err) => {
//   console.log('err', err);
// })
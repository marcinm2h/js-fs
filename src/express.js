const http = require('http');

const server = http.createServer((req, res) => {
  console.log('onReq', req.method, req.url);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(
    JSON.stringify({
      data: 'Hello world',
    }),
  );
  res.end();
});

[
  'checkContinue',
  'checkExpectation',
  'clientError',
  'close',
  'connect',
  'connection', // TCP stream is established
  'error',
  'listening', // no args
  'request', // req, res
  'upgrade',
].forEach((event) => {
  return;
  server.on(event, (...args) => {
    console.log(event);
  });
});

server.on('request', (req, res) => {
  console.log('res.writableEnded', res.writableEnded);
});

server.listen(process.env.PORT || 9900, null, () => {
  console.log(`server started at http://localhost:${server.address().port}`);
});

//FIXME: stub -> implementation
const express = () => ({
  get: () => {},
  listen: () => {},
});
const app = express();
app.get('/', (req, res) => {
  res.send('hello');
  // res.json({ hello: 'hello'})
});
const port = process.env.PORT || 3322;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

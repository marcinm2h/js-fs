const http = require('node:http');
const { readFile } = require('node:fs/promises');
const fs = require('node:fs');
const path = require('node:path');

const relativePath = (relative) => path.join(__dirname, relative);

function handleRoot(req, res) {
  console.log('GET /');
  readFile(relativePath('index.html'))
    .then((buffer) => {
      const html = buffer.toString('utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(html);
    })
    .catch((error) => {
      console.error(error);
      res.writeHead(500);
      res.end('error');
    });
}

function handleUpload(req, res) {
  // FIXME: get original file name and type & handle errors
  const file = fs.createWriteStream(relativePath('./example.pdf'));
  req.on('data', (chunk) => {
    file.write(chunk);
  });
  req.on('end', () => {
    file.end();
    res.end('uploaded');
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    return handleRoot(req, res);
  }
  if (req.url === '/upload' && req.method === 'POST') {
    return handleUpload(req, res);
  }
  res.writeHead(404);
  res.end('error 404');
});

const port = process.env.PORT || 9988;
server.listen(port, null, () => {
  console.log(`Server started at port ${port}`);
});

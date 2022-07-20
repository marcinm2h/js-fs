const http = require('node:http');
const { readFile } = require('node:fs/promises');
const fs = require('node:fs');
const path = require('node:path');

const relativePath = (relative) => path.join(__dirname, relative);

const parseContentType = (contentType) => {
  return {
    boundary: contentType
      .split(';')
      .map((x) => x.trim())
      .find((x) => x.includes('boundary'))
      .replace('boundary=', ''),
  };
};

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
  const file = fs.createWriteStream(relativePath('./example.pdf'));
  const { boundary } = parseContentType(req.headers['content-type']);
  console.log({ boundary });

  req.on('data', (chunk) => {
    // FIXME: get name and type from content-disposition
    // boundaryBuff = toBuffer(boundary) -> removeBuffer(chunk, boundaryBuff)
    console.log(chunk.toString());
    //     ------WebKitFormBoundaryWU4sApm8H2y03j3W
    // Content-Disposition: form-data; name="upload"; filename="test.txt"
    // Content-Type: text/plain

    // test

    // ------WebKitFormBoundaryWU4sApm8H2y03j3W
    // Content-Disposition: form-data; name="other"

    // other
    // ------WebKitFormBoundaryWU4sApm8H2y03j3W--
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

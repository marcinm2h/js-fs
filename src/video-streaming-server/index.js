const path = require('path');
const http = require('http');
const fs = require('fs');

const public = (parts) =>
  path.join(__dirname, 'public', ...(Array.isArray(parts) ? parts : [parts]));

const server = http.createServer((req, res) => {
  if (req.method.toLowerCase() === 'get' && req.url === '/') {
    fs.createReadStream(public('index.html')).pipe(res);
  } else if (req.method.toLowerCase() === 'get' && req.url === '/video') {
    const range = req.headers.range;
    if (!range) {
      return fs.createReadStream(public('video.mp4')).pipe(res);
    }
    console.log({ range });
    // { range: 'bytes=1081344-' }
    const MAX_CHUNK_SIZE = 10 ** 6;
    const videoSize = fs.statSync(public('video.mp4')).size;
    const start = Number(range.replace(/\D/g, '')); // 1081344
    const end = Math.min(start + MAX_CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
      'Accept-Ranges': 'bytes',
      'Content-Range': `bytes ${start}-${end}/${videoSize}`, // chunk bytes from-to/whole_video
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, headers);
    fs.createReadStream(public('video.mp4'), { start, end }).pipe(res);
  } else {
    res.writeHead(404);
    res.end('error 404');
  }
});

const port = process.env.PORT || 8909;

server.listen(port, null, () => {
  console.log(`⚡ server started at port ${port}`);
});

import { Readable } from 'node:stream';
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  const inStream = new Readable({
    read() {},
  });

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Transfer-Encoding', 'chunked');

  inStream.on('data', (buff) => {
    res.write(buff);
  });

  inStream.on('end', () => {
    res.end();
  });

  inStream.push('ABCDEFGHIJKLM');
  inStream.push('NOPQRSTUVWXYZ');

  setTimeout(() => {
    inStream.push('delayed');
  }, 2000);

  setTimeout(() => {
    inStream.push('delayed2');
    inStream.push(null);
  }, 4000);
});

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`​🚀 http://localhost:${PORT}`);
});

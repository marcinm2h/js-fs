import { Readable } from 'node:stream';
import { EventEmitter } from 'node:events';
import express from 'express';

const app = express();

const eventBus = new EventEmitter();

app.get('/test', (req, res) => {
  res.send(`
    <details>
      <summary>
        <h1>Todo list:</h1>
      </summary>
      <img src="http://placekitten.com/200/300" loading="lazy"/>
    </details>
  `);
});

app.get('/response', (req, res) => {
  const { sid, data } = req.query;
  eventBus.emit('response', { sid, data });

  res.send('Go back');
});

app.get('/', (req, res) => {
  res.redirect('/1'); // FIXME: random
});

app.get('/:sid', (req, res) => {
  const { sid } = req.params;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Keep-Alive', 'timeout=60');

  const inStream = new Readable({
    read() {},
  });

  inStream.on('data', (buff) => {
    res.write(buff);
  });

  inStream.on('end', () => {
    res.end();
  });

  eventBus.on('response', (resp) => {
    if (resp.sid !== sid) {
      return;
    }

    inStream.push(`
      <div>
        <p>You've chosen ${resp.data}</p>
      </div>
      <style>
        #question {
          display: none;
        }
      </style>
    `);
    inStream.push(null);
  });

  inStream.push(`
    <div id="question">
      <p>one or two?</p>
      <details>
        <summary>one</summary>
        <img src="/response?sid=${sid}&data=1" loading="lazy" style="visibility:hidden" />
      </details>
      <details>
        <summary>two</summary>
        <img src="/response?sid=${sid}&data=2" loading="lazy" style="visibility:hidden" />
      </details>
    </div>
  `);
});

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`​🚀 http://localhost:${PORT}`);
});

import { Readable } from 'node:stream';
import { EventEmitter } from 'node:events';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

const users = [
  { login: 'mm', name: 'Marcin', pw: 'mm' },
  { login: 'adm', name: 'Admin', pw: 'adm' },
];

app.use(bodyParser.urlencoded({ extended: true }));

const eventBus = new EventEmitter();

app.post('/login', (req, res) => {
  const { sid } = req.query;
  const { login, pw } = req.body;
  const user = users.find((user) => user.login === login && user.pw === pw);
  eventBus.emit('login', { sid, data: { name: user.name } });

  res.send('Go back');
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

  eventBus.on('login', (resp) => {
    if (resp.sid !== sid) {
      return;
    }

    inStream.push(`
      <div>
        <p>Logged in as ${resp.data.name}</p>
      </div>
      <style>
        #form, #question {
          display: none;
        }
      </style>
    `);
    inStream.push(null);
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
        #form, #question {
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
    <div id="form">
    <iframe name="dummyframe" id="dummyframe" style="display: none;"></iframe>
      <form id="form" action="/login?sid=${sid}" method="POST" target="dummyframe">
        <label>
          login: <input name="login" />
        </label>
        <label>
          password: <input name="pw" type="password" />
        </label>
        <input type="submit" />
      </form>
    </div>
  `);
});

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`​🚀 http://localhost:${PORT}`);
});

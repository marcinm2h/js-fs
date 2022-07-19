const http = require('node:http');

// TODO: middlewares, url matching eg. /a/*/b -> /a/b/b ...
// TODO: GET, POST, DELETE, HEAD, PUT, OPTIONS, CONNECT, TRACE
class Router {
  _state = {
    get: [],
  };
  use(router) {
    this._state.get = [...this._state.get, ...router._state.get];
  }
  getHandler(method, url) {
    const item = this._state[method.toLowerCase()].find(
      (item) => item.url === url,
    );
    return item ? item.handler : null;
  }
  get(url, handler) {
    this._state.get.push({ url, handler });
  }
}

const responseSendDecorator = (res) => {
  return {
    ...res,
    send: (val) => {
      res.writeHead(200);
      res.end(val);
    },
  };
};
const express = () => {
  const router = new Router();
  const app = {
    get: router.get.bind(router),
    use: (nextRouter) => {
      router.use(nextRouter);
    },
    listen: (port, onListen) => {
      const server = http.createServer((req, res) => {
        console.log('onReq', req.method, req.url);
        const handler = router.getHandler(req.method, req.url);
        if (handler) {
          return handler(req, responseSendDecorator(res));
        }
        // 404
      });
      server.listen(port, null, onListen);
      return app;
    },
  };
  return app;
};
express.Router = () => new Router();

const app = express();
app.get('/', (req, res) => {
  res.send('hello');
});

const r = express.Router();
r.get('/new', (req, res) => {
  res.send('new');
});

const r2 = express.Router();
r2.get('/r2', (req, res) => {
  res.send('r2');
});

r.use(r2);

app.use(r);

const port = process.env.PORT || 3322;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

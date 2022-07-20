const { express } = require('./express');

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

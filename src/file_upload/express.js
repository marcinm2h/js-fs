const path = require('node:path');
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, 'uploads/') });

const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('upload'), function (req, res, next) {
  console.log(req.file);
  // {
  //   fieldname: 'upload',
  //   originalname: 'test.txt',
  //   encoding: '7bit',
  //   mimetype: 'text/plain',
  //   destination: 'uploads/',
  //   filename: 'd9fa0b726676a53130dd15e4d6afdb5e',
  //   path: 'uploads/d9fa0b726676a53130dd15e4d6afdb5e',
  //   size: 5
  // }
  console.log(req.body.other);
  res.end('uploaded');
});

const port = process.env.PORT || 3344;

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

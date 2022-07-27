const Stream = require('stream');

class MyReadableStream extends Stream.Readable {
  dataToStream = ['one', 'two', 'three'];

  constructor(options) {
    super(options);
  }

  _read() {
    if (this.dataToStream.length === 0) {
      return this.push(null);
    }
    this.push(this.dataToStream.shift());
  }

  _destroy() {
    this.dataToStream = [];
  }
}

const readableStream = new MyReadableStream();

readableStream.on('data', (buffer) => {
  console.log('readableStream::data', buffer.toString());
});

readableStream.on('data', (buffer) => {
  console.log('second listener', buffer.toString('utf-8'));
});

readableStream.push('log me');
// readableStream.push('pong!');

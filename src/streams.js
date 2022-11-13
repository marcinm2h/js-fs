const Stream = require('stream');

const inStream = new Stream.Readable({
  read() {},
});

inStream.pipe(process.stdout);

inStream.push('ABCDEFGHIJKLM');
inStream.push('NOPQRSTUVWXYZ');

setTimeout(() => {
  inStream.push('delayed');
  inStream.push(null);
}, 1000);

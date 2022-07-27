let buffer = Buffer.alloc(8); // 8 bytes

console.log(buffer, buffer.length);
buffer = Buffer.from([1, 2, 3]);
console.log(buffer, buffer[0], buffer.length);
buffer = Buffer.from('string xxx', 'utf-8');
console.log(buffer, buffer[0], String.fromCharCode(buffer[0]), buffer.length);

buffer = Buffer.alloc(16);
let bytesWritten = buffer.write('hello', 'utf-8');
console.log('hello', buffer, buffer.toString('utf-8'), { bytesWritten });
bytesWritten = buffer.write(' world', 'utf-8');
console.log(' world', buffer, buffer.toString('utf-8'), { bytesWritten });

bytesWritten = buffer.write('hello', 'utf-8');
console.log('hello', buffer, buffer.toString('utf-8'), { bytesWritten });
buffer.write(' world', bytesWritten, 'utf-8'); // write from bytesWritten
console.log(
  'hello world',
  buffer,
  buffer.toString('utf-8'),
  buffer.toString('utf-8').length,
  { bytesWritten },
);
// hello world <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64 00 00 00 00 00> hello world 16 { bytesWritten: 5 }
console.log(
  buffer.toString('utf-8', 0, 12),
  buffer.toString('utf-8', 0, 12).length,
);
// hello world 12
console.log(Buffer.isBuffer(buffer), typeof buffer, buffer instanceof Buffer);
// true object true
console.log(Buffer.byteLength('☃'));
// 3

// https://nodejs.org/en/knowledge/advanced/buffers/how-to-use-buffers/
const frosty = Buffer.alloc(24);
const snowman = Buffer.from('☃', 'utf-8');
frosty.write('Happy birthday! ', 'utf-8');
snowman.copy(frosty, 16);
console.log(frosty.toString('utf-8', 0, 19));
// Happy birthday! ☃

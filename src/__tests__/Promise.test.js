const { P } = require('../Promise');

// new P((resolve, reject) => {
//   setTimeout(() => {
//     // reject("new P()");
//     resolve('new P()');
//   }, 100);
// })
//   // .catch((e) => console.log("catch", e))
//   .then((x) => console.log('x0', x) || 'from x0')
//   .then((x) => console.log('x1', x) || 'from x1')
//   .catch((e) => console.log('e1', e))
//   .then((x) => console.log('x2', x.y.z))
//   .catch((e) => console.log('e2 err', e));

// P.resolve('a').then((x) => console.log({ x }));

// console.log('sync');

test('Promise', () => {
  return P.resolve('test').then((data) => {
    expect(data).toBe('test');
  });
});

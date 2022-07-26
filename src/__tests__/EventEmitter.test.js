const { EventEmitter } = require('../EventEmitter');

test('EventEmitter', () => {
  const mock = jest.fn();

  const ee = new EventEmitter();
  ee.on('evt', mock);
  ee.trigger('evt', ['a', 'b']);
  ee.off('evt', mock);
  ee.trigger('evt', ['c', 'd']);

  expect(mock).toBeCalledWith(['a', 'b']);
  expect(mock).toBeCalledTimes(1);
});

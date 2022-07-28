const createLogger = (domain) => {
  return {
    log: (...args) => console.log([domain], ...args),
  };
};
module.exports = {
  createLogger,
};

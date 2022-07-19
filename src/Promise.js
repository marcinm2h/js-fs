class Promise {
  static resolve(val) {
    return new Promise((resolve) => {
      resolve(val);
    });
  }
  static reject(error) {
    return new Promise((resolve, reject) => {
      reject(error);
    });
  }
  state = 'pending'; // pending | fulfilled | rejected
  onFullfilled = () => {};
  onReject = () => {};
  constructor(setupFn) {
    const reject = (error) => {
      this.state = 'rejected';
      setTimeout(() => {
        this.onReject(error);
      }, 0);
    };
    const resolve = (val) => {
      setTimeout(() => {
        this.onFullfilled(val);
      }, 0);
      this.state = 'fulfilled';
    };
    setupFn(resolve, reject);
  }
  then(onFullfilled) {
    this.onFullfilled = onFullfilled;
    const p = new Promise((resolve, reject) => {
      const onFullfilledPrev = this.onFullfilled;
      this.onFullfilled = (val) => {
        try {
          const prev = onFullfilledPrev(val);
          resolve(prev);
        } catch (error) {
          p.onReject(error);
        }
      };
    });
    return p;
  }
  catch(onReject) {
    this.onReject = onReject;
    return new Promise((resolve) => {
      this.onFullfilled = (val) => {
        resolve(val);
      };
      const onRejectPrev = this.onReject;
      this.onReject = (error) => {
        onRejectPrev(error);
        resolve();
      };
    });
  }
}

module.exports = { Promise };

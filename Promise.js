class P {
  state = "pending"; // pending | fulfilled | rejected
  onFullfilled = () => {};
  onReject = () => {};
  constructor(setupFn) {
    const reject = (error) => {
      this.state = "rejected";
      this.onReject(error);
    };
    const resolve = (val) => {
      this.onFullfilled(val);
      this.state = "fulfilled";
    };
    setupFn(resolve, reject);
    return this;
  }
  then(onFullfilled) {
    this.onFullfilled = onFullfilled;
    const p = new P((resolve, reject) => {
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
    return new P((resolve) => {
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

new P((resolve, reject) => {
  setTimeout(() => {
    // reject("new P()");
    resolve("new P()");
  }, 100);
})
  .catch((e) => console.log("catch", e))
  .then((x) => console.log("x0", x) || "from x0")
  .then((x) => console.log("x1", x) || "from x1")
  .catch((e) => console.log("e1", e))
  .then((x) => console.log("x2", x.y.z))
  .catch((e) => console.log("e2 err", e));

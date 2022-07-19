class EventEmitter {
  state = {};
  on(eventName, handler) {
    if (!this.state[eventName]) {
      this.state[eventName] = [];
    }
    this.state[eventName].push(handler);
  }
  off(eventName, handler) {
    if (!this.state[eventName]) {
      return;
    }
    this.state[eventName] = this.state[eventName].filter((h) => h !== handler);
  }
  trigger(eventName, ...args) {
    const listeners = this.state[eventName] || [];
    listeners.forEach((handler) => {
      handler(...args);
    });
  }
}

module.exports = { EventEmitter };

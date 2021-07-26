type ITake = Function;

class EventEmitter {
  take: ITake[]

  constructor() {
    this.take = [];
  }

  on(callback: Function) {
    this.take.push(callback);
  }

  run() {
    this.take.forEach((callback) => {
      callback();
    });
  }
}

export default EventEmitter;

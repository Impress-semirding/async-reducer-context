type ITake = () => void;

class EventEmitter {
  take: ITake[]

  constructor() {
    this.take = [];
  }

  on(callback: any) {
    this.take.push(callback);
  }

  run() {
    this.take.forEach((callback) => {
      callback();
    });
  }
}

export default EventEmitter;

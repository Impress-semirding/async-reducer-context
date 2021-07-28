class Subs {
  observers: Function[]

  constructor() {
    this.observers = [];
  }

  add(observer: Function) {
    this.observers.push(observer);
  }

  notify() {
    this.observers.forEach((observer) => observer());
  }

  delete(observer: Function) {
    const index = this.observers.findIndex((item) => item === observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }
}

export default Subs;

class Subs {
  state: any;

  observers: any[]

  constructor(state: any) {
    this.state = state;
    this.observers = [];
  }

  add(observer: any[]) {
    this.observers.push(observer);
  }

  notify() {
    this.observers.forEach((observer) => observer());
  }

  delete(observer: any[]) {
    const index = this.observers.findIndex((item) => item === observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }
}

export default Subs;

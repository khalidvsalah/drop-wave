class Store {
  constructor() {
    this.store = new WeakMap();
  }

  set(key, value) {
    this.store.set(key, value);
  }

  get(key) {
    return this.store.get(key);
  }
}

export default Store;

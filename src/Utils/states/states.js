class States {
  constructor() {
    this.store = new Map();
  }

  /**
   * @param {string} name - observer name
   * @returns {{notify:Function, remove:Function}}
   */
  create(name) {
    const store = this.store;
    store.set(name, { cbs: new Set() });

    return {
      notify: () => {
        let { cbs } = store.get(name);
        let args = Array.from(arguments);
        cbs.forEach(cb => cb(args));
      },
      remove: () => store.delete(name)
    };
  }

  /**
   * @param {string} name - observer name
   * @param {object} cb - callback function
   * @returns {{remove: ()=> void}}
   */
  subscribe(name, cb) {
    if (!this.store.has(name)) throw new Error(name, 'Undefined');
    let { cbs } = this.store.get(name);
    cbs.add(cb);
    return { remove: () => cbs.delete(cb) };
  }

  /**
   * @param {string} name - observer name
   */
  check(name) {
    return this.store.has(name);
  }
}

export const states = new States();

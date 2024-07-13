/**
 * Observer
 */
class Observer {
  #observers = {};

  /**
   * @param {string} name - observer name
   */
  create(name) {
    this.#observers[name] = { items: [], id: 0 };
    function callItem() {
      let target = this[name];
      let args = Array.prototype.slice.call(arguments);

      for (let i = 0; i < target.items.length; i++) {
        target.items[i].cb(...args);
      }
    }

    let remove = name => (this.#observers[name].items = []);

    return {
      cb: callItem.bind(this.#observers),
      name,
      r: remove.bind(this, name)
    };
  }

  /**
   * @param {String} name - observer name
   * @param {Function} cb - callback function
   */
  subscribe(name, cb) {
    if (!this.#observers[name]) console.error(name);

    let items = this.#observers[name].items;
    let id = ++this.#observers[name].id;
    let obj = { cb, id, subscribed: true };

    items.push(obj);

    let remove = o => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === o.id) {
          items[i].subscribed = false;
          items.splice(i, 1);
        }
      }
    };

    return {
      onChange: cb => {
        obj.cb = cb;
        return {
          r: () => remove(obj),
          item: obj
        };
      }
    };
  }

  /**
   * @param {String} name - observer name
   */
  check(name) {
    return this.#observers[name] ? true : false;
  }
}

export default new Observer();

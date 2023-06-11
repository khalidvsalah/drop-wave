class Subscribe {
  constructor() {
    this.subs = {};
  }

  obs(name) {
    this.subs[name] = { cb: null, items: [] };
    this.subs[name].cb = function () {
      var args = Array.prototype.slice.call(arguments);

      for (let i = 0; i < this.items.length; i++) {
        var o = this.items[i];
        o.cb(...args);
      }
    }.bind(this.subs[name]);

    return { cb: this.subs[name].cb, name };
  }

  add(name, cb) {
    this.subs[name].items.push({ cb, id: this.subs[name].items.length + name });
    return this.subs[name].items.length - 1 + name;
  }

  remove(name, i) {
    if (i.match(name) == null) {
      console.error(i + " is not in " + name);
      return;
    }
    var item = this.subs[name].items;
    this.subs[name].items = item.filter(({ id }) => id !== i);
  }

  check(name) {
    return this.subs[name] ? true : false;
  }
}

export default new Subscribe();

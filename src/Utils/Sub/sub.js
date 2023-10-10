class Sub {
  constructor() {
    this.subs = {};
  }

  obs(name) {
    this.subs[name] = { items: [] };
    function callItem() {
      let target = this[name];
      let args = Array.prototype.slice.call(arguments);

      for (let i = 0; i < target.items.length; i++) {
        target.items[i].cb(...args);
      }
    }

    let r = (name) => {
      this.subs[name].items = [];
    };

    return {
      cb: callItem.bind(this.subs),
      name,
      r: r.bind(this, name),
    };
  }

  add(name, cb) {
    if (!this.subs[name]) console.error(name);

    let items = this.subs[name].items;
    let obj = { cb, id: items.length + 1, on: true };

    items.push(obj);

    let r = (o) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id == o) {
          items[i].on = false;
          items.splice(i, 1);
        }
      }
    };

    return {
      item: obj,
      r: r.bind({}, obj.id),
    };
  }

  check(name) {
    return this.subs[name] ? true : false;
  }
}

export default new Sub();

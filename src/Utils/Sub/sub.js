class Sub {
  constructor() {
    this.subs = {};
  }

  obs(name) {
    function callItem() {
      let t = this[name];
      let args = Array.prototype.slice.call(arguments);
      for (let i = 0; i < t.items.length; i++) {
        t.items[i].cb(...args);
      }
    }
    this.subs[name] = { items: [] };

    return {
      cb: callItem.bind(this.subs),
      name,
    };
  }

  add(name, cb) {
    if (!this.subs[name]) console.error(name);

    let items = this.subs[name].items;
    let obj = { cb, id: items.length + 1 };

    items.push(obj);

    let r = (o) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id == o) items.splice(i, 1);
      }
    };

    return {
      r: r.bind({}, obj.id),
    };
  }

  check(name) {
    return this.subs[name] ? true : false;
  }
}

export default new Sub();

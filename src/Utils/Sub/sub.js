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
    let i = this.subs[name].items;
    i.push({ cb, id: i.length + 1 });

    let r = (o) => {
      for (let k = 0; k < i.length; i++) {
        if (i[k].id === o) i.splice(i, 1);
      }
    };

    return {
      r: r.bind({}, i.length),
    };
  }

  check(name) {
    return this.subs[name] ? true : false;
  }
}

export default new Sub();

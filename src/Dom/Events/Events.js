function callCbs(e) {
  var loop = this.o[e.type];
  var fs = Object.values(loop.items);

  for (let i = 0; i < fs.length; i++) {
    fs[i](e);
  }
}

class Events {
  constructor() {
    this.id = -1;
    this.o = {
      wheel: { items: {}, length: 0, o: false },
      keydown: { items: {}, length: 0, o: false },
      resize: { items: {}, length: 0, o: false },
      mousedown: { items: {}, length: 0, o: false },
      mouseleave: { items: {}, length: 0, o: false },
      mousemove: { items: {}, length: 0, o: false },
    };
  }

  add(e, cb) {
    ++this.id;
    this.o[e].items[this.id] = cb;
    ++this.o[e].length;
    return this.id;
  }

  remove(e, id) {
    var ev = this.o[e];
    --this.o[e].length;
    delete ev.items[id];
  }

  changeO(e, o = false) {
    var a = this.o[e];
    if (o === "p") {
      a.o = { passive: false };
    } else {
      a.o = o;
    }
  }

  fire() {
    var props = Object.entries(this.o);
    for (let i = 0; i < props.length; i++) {
      var prop = props[i];

      if (prop[1].length) {
        window.addEventListener(prop[0], callCbs.bind(this), prop[1].o);
      }
    }
  }
}

export default new Events();

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
      wheel: { items: {}, o: false },
      keydown: { items: {}, o: false },
      resize: { items: {}, o: false },
      mousedown: { items: {}, o: false },
      mouseleave: { items: {}, o: false },
      mousemove: { items: {}, o: false },
    };
  }

  subAdd(e, cb) {
    if (!e || !cb) {
      console.warn("You need to event type & id");
      return;
    }
    ++this.id;
    var event = this.o[e];
    event.items[this.id] = cb;

    if (!event.fired) {
      this.fire();
    }
    return this.id;
  }

  subRemove(e, id) {
    if (!id || !e) {
      console.warn("You need to event type & id");
      return;
    }
    var ev = this.o[e];
    if (ev.items[id]) {
      delete ev.items[id];
    }
  }

  add(ele, eType, cb, o = false) {
    ele.addEventListener(eType, cb, o);
  }

  remove(ele, eType, cb) {
    ele.removeEventListener(eType, cb);
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
      var items = Object.values(props[i][1].items);

      if (items.length && !prop[1].fired) {
        prop[1].fired = true;
        window.addEventListener(prop[0], callCbs.bind(this), prop[1].o);
      }
    }
  }
}

export default new Events();

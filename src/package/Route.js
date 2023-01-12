class _R {
  constructor() {
    this.cache = new Map();
  }

  async xhr(u, p, m, t) {
    if (!this.cache.get(u)) {
      try {
        const requst = new Request(u, {
          headers: new Headers({
            "Content-type": t
              ? "application/x-ww-form-urlencodeed"
              : "text/html",
          }),
          method: m ? "POST" : "GET",
          mode: "cors",
        });
        const responed = await fetch(requst);
        const text = t ? await responed.json() : await responed.text();

        p && window.history.pushState({}, "", u);

        const res = {
          url: url.match(/(?:\w+:)?\/\/[^\/]+([^?#]+)/)[1],
          data: text,
          stored: false,
        };

        this.cache.set(u, res);
        return res;
      } catch {
        console.error("Failed To Get The Data");
      }
    } else {
      p && window.history.pushState({}, "", u);
      return { ...this.cache.get(url), stored: true };
    }
  }
}

export default new _R();

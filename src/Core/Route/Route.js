class _R {
  constructor() {
    this.cache = new Map();
  }

  match(url) {
    return url.match(/(?:\w+:)?\/\/[^\/]+([^?#]+)/);
  }

  async xhr({ url, push, post, isText, compile }) {
    if (!this.cache.get(url)) {
      try {
        var text;

        if (compile) {
          const requst = new Request(url, {
            headers: new Headers({
              "Content-type": isText
                ? "application/x-ww-form-urlencodeed"
                : "text/html",
            }),
            method: post ? "POST" : "GET",
            mode: "cors",
          });
          const responed = await fetch(requst);
          text = isText ? await responed.json() : await responed.text();
        }

        push && window.history.pushState({}, "", url);
        const match = this.match(url);

        const res = {
          url: match ? match[1] : url,
          data: compile ? text : "",
          stored: false,
        };

        this.cache.set(url, res);
        return res;
      } catch (e) {
        console.error("Failed To Get The Data", e.message);
      }
    } else {
      push && window.history.pushState({}, "", url);
      return { ...this.cache.get(url), stored: true };
    }
  }

  store(url, text) {
    const match = this.match(url);

    const res = {
      url: match ? match[1] : url,
      data: text,
      stored: true,
    };

    this.cache.set(url, res);
  }
}

export default new _R();

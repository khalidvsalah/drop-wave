class _R {
  constructor() {
    this.cache = new Map();
  }

  match(url) {
    return url.match(/^(https?):\/\/([^/?#]+)(\/[^?#]*)?(\?[^#]*)?(#.*)?$/);
  }

  async xhr(url, post, page) {
    if (!this.cache.get(url)) {
      try {
        const requst = new Request(url, {
          headers: new Headers({
            "Content-type": page
              ? "text/html"
              : "application/x-ww-form-urlencodeed",
          }),
          method: post ? "POST" : "GET",
          mode: "cors",
        });

        const fetchd = await fetch(requst);
        const responed = page ? await fetchd.text() : await fetchd.json();

        const match = this.match(url);

        const res = {
          url: match,
          data: responed,
        };

        this.cache.set(url, res);
        return res;
      } catch (e) {
        console.error("Failed To Get The Data", e.message);
      }
    } else {
      return { ...this.cache.get(url) };
    }
  }

  store(url, text) {
    const match = this.match(url);

    const res = {
      url: match,
      data: text,
    };

    this.cache.set(url, res);
  }
}

export default new _R();

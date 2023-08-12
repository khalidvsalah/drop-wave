async function xhr(o) {
  try {
    let t = o.type == "json";

    const requst = new Request(o.url, {
      headers: new Headers({
        "Content-type": t ? "text/html" : "application/x-ww-form-urlencodeed",
      }),
      method: t ? "POST" : "GET",
      mode: "same-origin",
    });

    if (o.body) requst.body = o.body;

    const data = await fetch(requst);
    const parser = await data[t ? "json" : "text"]();

    o.cb({ url: o.url, parser });
  } catch (e) {
    console.error(e.message);
  }
}

export default xhr;

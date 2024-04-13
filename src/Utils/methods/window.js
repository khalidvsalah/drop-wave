const win = {
  get screen() {
    return { w: window.innerWidth, h: window.innerHeight };
  },
  html: document.html,
  body: document.body
};

export default win;

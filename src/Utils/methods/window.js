export const win = {
  get screen() {
    return { w: window.innerWidth, h: window.innerHeight };
  },
  html: document,
  window,
  title: document.title,
  head: document.head,
  body: document.body,
};

export const win = {
  get screen() {
    return { w: window.innerWidth, h: window.innerHeight };
  },
  html: document,
  body: document.body
};

const css = {
  alpha: (e, v) => (e.style.opacity = v),
  display: (e, v) => (e.style.display = v),
  pointer: (e, v) => (e.style.pointerEvents = v),
  position: (e, v) => (e.style.position = v),
  visible: (e, v) => (e.style.visibility = v),
  form: (e, p, x, y) => (e.style.transform = `translate3d(${x + p},${y + p},0)`)
};

export default css;

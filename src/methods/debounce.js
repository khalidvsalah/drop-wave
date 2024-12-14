export function debounce({ time, cb }) {
  time *= 1000;
  let timer = 0;

  return () => {
    clearTimeout(timer);
    timer = setTimeout(cb, time);
  };
}

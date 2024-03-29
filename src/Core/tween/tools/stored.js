const store = new Map();

export default function stored(node, tweenClass) {
  let stored = store.get(node);

  if (stored) return stored;
  else {
    store.set(node, tweenClass);
    return false;
  }
}

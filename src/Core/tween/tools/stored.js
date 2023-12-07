const store = new Map();

export default function stored(node) {
  let stored = store.get(node);

  if (stored) {
    return stored;
  } else {
    store.set(node, this);
    return false;
  }
}

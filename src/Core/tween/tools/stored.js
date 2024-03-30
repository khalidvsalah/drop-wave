const store = new Map();

export default function stored(node, tweenClass) {
  let stored = store.get(node);

  if (!stored) {
    store.set(node, tweenClass);
    tweenClass.init(node);
    return tweenClass;
  } else {
    return stored;
  }
}

function storeO() {
  const store = new Map();

  return (o) => {
    var getO = store.get(o);

    if (getO) {
      return getO;
    } else {
      store.set(o, o);
      return false;
    }
  };
}

export default storeO();

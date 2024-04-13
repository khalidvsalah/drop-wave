const isHas = (e, p) => window.hasOwnProperty.call(e, p);
const toString = obj => JSON.stringify(obj);

export { isHas, toString };

const match = (file, path) => {
  let group = file.match(/o:(.*)/);
  if (group) return group[1];
  else return path + file;
};

const modify = (file, path) => {
  if (typeof file == 'object')
    return file.map((obj) => ({
      ...obj,
      dest: match(obj.dest, path)
    }));
  else return match(file, path);
};

export default (config, mode) => {
  let keys = Object.keys(config.langs);

  keys.forEach((key) => {
    let lang = config.langs[key];
    lang.entry = lang.entry.map((file) => modify(file, config.src));
    if (!mode) lang.watch = lang.watch.map((file) => config.src + file);
    lang.dest = lang.dest.map((file) => modify(file, config.dest));
  });
};

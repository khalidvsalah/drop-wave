export default (config, mode) => {
  let keys = Object.keys(config.langs);

  keys.forEach((key) => {
    let lang = config.langs[key];

    lang.entry = lang.entry.map((file) => {
      let group = file.match(/o:(.*)/);
      if (group) return group[1];
      else return config.src + file;
    });

    if (!mode) {
      lang.watch = lang.watch.map((file) => config.src + file);
    }

    lang.dest = lang.dest.map((file) => {
      let group = file.match(/o:(.*)/);
      if (group) return group[1];
      else return config.dest + file;
    });
  });
};

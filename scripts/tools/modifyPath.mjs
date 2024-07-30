const replace = (file) => file.replaceAll("/", "\\");

const modify = (file, src) => {
  let group = file.match(/o:(.*)/);
  if (group) return replace(group[1]);
  else return replace(src + file);
};

const modifyLang = (entry, src) => {
  if (entry) {
    if (Array.isArray(entry)) {
      return entry.map((file) => modify(file, src));
    } else return modify(entry, src);
  }
};

const modifyPath = ({ src, dest, changes }) => {
  let keys = Object.keys(changes);

  keys.forEach((key) => {
    let lang = changes[key];

    lang.src = modifyLang(lang.src, src);
    lang.watch = modifyLang(lang.watch, src);
    lang.dest = modifyLang(lang.dest, dest);
  });
};

export default modifyPath;

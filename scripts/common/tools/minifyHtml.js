import copydir from "copy-dir";

export default function compileHtml({ entry, dest, cb }) {
  Promise.resolve(copydir(entry[0], dest[0], { cover: true })).then(cb);
}

import modifyPath from '../tools/modifyPath.mjs';

const config = {
  src: 'src/',
  dest: 'dist/',
  changes: {
    js: {
      src: 'index.js',
      dest: 'stabraq.esm.js'
    }
  }
};

modifyPath(config);
export default config;

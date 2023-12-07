import modifyPath from '../../common/methods/modifyPath.js';
import eslint from '../../common/config/eslint.js';

let config = {
  src: 'src/',
  dest: 'package/',
  langs: {
    js: {
      entry: ['index.js', 'Plugins/index.js'],
      dest: ['src/main.js', 'plugins/index.js'],
      eslint
    },
    css: {
      entry: [],
      dest: []
    },
    html: {
      entry: [],
      dest: []
    },
    copy: {
      entry: [],
      dest: []
    }
  },
  mode: 'PROD'
};

modifyPath(config, true);
export default config;

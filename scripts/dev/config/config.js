import modifyPath from '../../common/methods/modifyPath.js';
import eslint from '../../common/config/eslint.js';

let config = {
  src: 'src/',
  dest: 'package/',
  langs: {
    js: {
      entry: ['index.js'],
      dest: ['stabraq.js'],
      watch: ['index.js', '/**/*'],
      eslint
    },
    css: {
      entry: [],
      dest: [],
      watch: []
    },
    html: {
      entry: [],
      dest: [],
      watch: []
    },
    copy: {
      entry: [],
      dest: [],
      watch: []
    }
  },
  mode: 'DEV'
};

modifyPath(config, false);
export default config;

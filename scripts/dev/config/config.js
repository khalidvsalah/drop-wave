import modifyPath from '../../common/methods/modifyPath.js';
import eslint from '../../common/config/eslint.js';

let config = {
  src: 'src/',
  dest: 'dist/',
  langs: {
    js: {
      entry: ['index.js', 'Plugins/index.js'],
      dest: ['main.js', 'plugins/index.js'],
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

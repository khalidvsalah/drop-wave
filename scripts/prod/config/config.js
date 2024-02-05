import modifyPath from '../../common/methods/modifyPath.js';
import eslint from '../../common/config/eslint.js';

let config = {
  src: 'src/',
  dest: 'dist/',
  langs: {
    js: {
      entry: ['index.js'],
      dest: [
        [
          { dest: 'stabraq.js', format: 'cjs' },
          { dest: 'stabraq.esm.js', format: 'esm' }
        ]
      ],
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

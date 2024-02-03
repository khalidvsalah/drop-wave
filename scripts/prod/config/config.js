import modifyPath from '../../common/methods/modifyPath.js';
import eslint from '../../common/config/eslint.js';

let config = {
  src: 'src/',
  dest: 'dist/',
  langs: {
    js: {
      entry: ['index.js', 'Plugins/index.js'],
      dest: [
        [
          { dest: 'stabraq.js', format: 'cjs' },
          { dest: 'stabraq.esm.js', format: 'esm' }
        ],
        [
          { dest: 'plugins/stabraq.plugins.js', format: 'cjs' },
          { dest: 'plugins/stabraq.plugins.esm.js', format: 'esm' }
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

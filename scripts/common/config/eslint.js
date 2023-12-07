const obj = {
  extends: 'standard',
  env: {
    browser: true
  },
  plugins: ['import', 'promise'],
  rules: {
    'no-console': 2,
    'no-unused-vars': 0,
    quotes: 0,
    semi: 0,
    'space-before-function-paren': 0,
    'no-useless-constructor': 0,
    'spaced-comment': 0,
    'array-callback-return': 0
  },
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module'
  }
};

export default obj;

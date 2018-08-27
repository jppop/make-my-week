module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:flowtype/recommended'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      //            "experimentalObjectRestSpread": true,
      jsx: true
    },
    sourceType: 'module'
  },
  plugins: ['react', 'flowtype'],
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-console': 0,
    'no-undef': 0,
    'no-unused-vars': 0
  }
};

module.exports = {
  env: {
    es6: true,
    node: true,
  },
  rules: {
    'no-console': 0,
    'no-return-assign': 0,
  },
  extends: ['eslint:recommended', 'airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 2020,
  },
}

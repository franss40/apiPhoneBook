module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': 0,
    'linebreak-style': 0,
    semi: ['error', 'never'],
    indent: ['error', 2],
    'arrow-parens': [0, 'ban-single-arg-parens', 'error', 'as-needed'],
  },
}

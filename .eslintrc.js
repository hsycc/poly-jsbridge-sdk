/**
 * /*
 *
 * @format
 * @Author: hsycc
 * @Date: 2021-11-18 17:45:24
 * @LastEditTime: 2021-11-18 18:19:42
 * @Description:
 */

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'prettier/@typescript-eslint'],
  plugins: ['@typescript-eslint', 'prettier'],
  env: {
    browser: true,
    es6: true,
  },
  rules: {
    semi: ['error', 'always'],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-this-alias': 0,
  },
};

module.exports = {
  parser: '@babel/eslint-parser',
  /** 
   * In eslint the `extends` keyword  is used to apply all of the rules from a specific package configuration. 
   * 
   * In contrast to the `plugins` keyword, which is does not apply any rules, but only provides them in the case we want to override rules or customize them.
  */
  extends: [
    'eslint:recommended',
    'plugin:jest-dom/recommended',
    'plugin:testing-library/react',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'babel'
  ],
  env: {
    browser: true,
    node: true,
    jest: true,
    es2021: true
  }
};
module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ["plugin:prettier/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {},
};

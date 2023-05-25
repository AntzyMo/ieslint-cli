module.exports = {  
  env: {
  es6: true,
  browser: true,
  node: true,
},
reportUnusedDisableDirectives: true,
extends: [
  './standard',
  'plugin:import/recommended',
  'plugin:eslint-comments/recommended',
  'plugin:jsonc/recommended-with-jsonc',
  'plugin:yml/standard',
  'plugin:markdown/recommended',
],
ignorePatterns: [
  '*.min.*',
]}
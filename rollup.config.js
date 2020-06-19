'use strict';

const resolve = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const replace = require('@rollup/plugin-replace');

module.exports = () => ({
  input: './src/index.mjs',
  output: [
    {
      file: './dist/bundle.js',
      format: 'umd',
    },
  ],
  plugins: [
    replace({
      __ENVIRONMENT__: `${JSON.stringify(require('dotenv').config().parsed)}`,
    }),
    resolve(),
    terser(),
  ],
  onwarn(warning, warn) {
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      // Squelch.
      return;
    }
    warn(warning);
  },
});

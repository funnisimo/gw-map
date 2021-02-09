
// GW-CANVAS: rollup.config.js

import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";

// import peerDepsExternal from 'rollup-plugin-peer-deps-external';
// import { nodeResolve } from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';

export default [{
  input: 'js/gw.js',
  external: ['gw-utils'],
  output: [{
    file: 'dist/gw-map.min.js',
    format: 'umd',
    name: 'GW',
    freeze: false,
    extend: true,
    sourcemap: true,
    globals: {
      'gw-utils': 'GW'
    },
    plugins: [terser()]
  },
  {
    file: 'dist/gw-map.js',
    format: 'umd',
    name: 'GW',
    freeze: false,
    extend: true,
    sourcemap: true,
    globals: {
      'gw-utils': 'GW'
    },
  },
  {
    file: 'dist/gw-map.cjs',
    format: 'cjs',
    freeze: false,
    globals: {
      'gw-utils': 'GW'
    }
  },
  {
    file: 'dist/gw-map.mjs',
    format: 'es',
    freeze: false,
    globals: {
      'gw-utils': 'GW'
    }
  }]
},
{
  input: "./js/gw.d.ts",
  output: [{ file: "dist/gw-map.d.ts", format: "es" }],
  plugins: [dts()],
},

];
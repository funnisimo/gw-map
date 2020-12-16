
// GW-CANVAS: rollup.config.js

import { terser } from "rollup-plugin-terser";


export default [{
  input: 'js/gw.js',
  output: {
    file: 'dist/gw-map.min.js',
    format: 'umd',
    name: 'GW',
    freeze: false,
    extend: true,
    sourcemap: true,
    plugins: [terser()]
  }
},
{
  // Really?  Do we need this?
  input: 'js/gw.js',
  output: {
    file: 'dist/gw-map.js',
    format: 'cjs',
    freeze: false,
  }
},

];
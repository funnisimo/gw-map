// GW-CANVAS: rollup.config.js

import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';

// import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { nodeResolve } from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';

export default [
    {
        input: 'js/index.js',
        external: ['gw-utils'],
        plugins: [nodeResolve()],
        output: [
            {
                file: 'dist/gw-map.min.js',
                format: 'umd',
                name: 'GWM',
                // freeze: false,
                // extend: true,
                sourcemap: true,
                globals: {
                    'gw-utils': 'GWU',
                },
                plugins: [terser()],
            },
            {
                file: 'dist/gw-map.js',
                format: 'umd',
                name: 'GWM',
                // freeze: false,
                // extend: true,
                sourcemap: true,
                globals: {
                    'gw-utils': 'GWU',
                },
            },
            {
                file: 'dist/gw-map.mjs',
                format: 'es',
                // freeze: false,
                globals: {
                    'gw-utils': 'GWU',
                },
            },
        ],
    },
    {
        input: './js/index.d.ts',
        output: [{ file: 'dist/gw-map.d.ts', format: 'es' }],
        plugins: [dts()],
    },
];

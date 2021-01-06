import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import generatePackageJson from 'rollup-plugin-generate-package-json'
import json from '@rollup/plugin-json';
import scss from 'rollup-plugin-scss'
import { terser } from "rollup-plugin-terser";
import copy from "rollup-plugin-copy-assets";



export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundles/bundle.js',
        format: 'cjs'
    },
    external: ['react', 'react-dom'],
    plugins: [
        resolve({ extensions: ['.jsx', '.js'] }),
        commonjs({
            namedExports: {
                'node_modules/react-is/index.js': ['isValidElementType', 'isElement']
            }
        }),
        babel({
            extensions: ['.jsx', '.js'],
            exclude: 'node_modules/**'
        }),
        generatePackageJson({
            outputFolder: 'dist',
            baseContents: (pkg) => ({
                name: pkg.name,
                main: 'bundles/bundle.js',
                version: pkg.version,
                description: pkg.description,
                homepage: pkg.homepage,
                peerDependencies: {
                    "react": "^16.13.0",
                    "react-dom":"^16.13.0"
                }
            })
        }),
        copy({
            assets: [
                "../README.md",
                "../LICENSE"
            ],
        }),
        scss(),
        json(),
        terser(),
    ]
};

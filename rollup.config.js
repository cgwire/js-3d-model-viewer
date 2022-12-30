import commonjs from '@rollup/plugin-commonjs'
import noderesolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/js-3d-model-viewer.js',
      format: 'umd',
      sourcemap: true,
      name: 'Js3dModelViewer'
    },
    plugins: [
      commonjs(),
      noderesolve(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      })
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/js-3d-model-viewer.min.js',
      format: 'umd',
      sourcemap: true,
      name: 'Js3dModelViewer'
    },
    plugins: [
      commonjs(),
      noderesolve(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      }),
      terser({
        output: {
          source_map: {
            includeSources: true
          }
        }
      })
    ]
  }
]

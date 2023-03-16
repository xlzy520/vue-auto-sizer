import pkg from './package.json'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import PluginVue from "rollup-plugin-vue"
import terser from "@rollup/plugin-terser"

const name = pkg.name
const globals = {
  'vue': 'Vue'
}

export default {
  input: 'src/index.js',
  output: [
    {
      name,
      file: pkg.main,
      format: 'umd',
      globals,
      plugins: [terser()]
    },
    {
      name,
      file: pkg.module,
      format: 'esm',
      globals,
      plugins: [terser()]
    }
  ],
  plugins: [
    PluginVue(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude:'node_modules/**'
    }),
  ],
  external: ['vue']
}

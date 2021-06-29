import ts from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import size from 'rollup-plugin-filesize'

const typeModule = process.env.modtype || 'esm'
export default {
  input: 'src/index.ts',
  output: {
    // dir: 'dist',
    format: typeModule,
    file: `dist/${typeModule}/index.js`
  },
  plugins: [
    ts({ include: ['./src/**/*.ts'] }),
    terser({
      mangle: false
    }),
    size()
  ],
  external: ['ws']
}

import ts from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import size from 'rollup-plugin-filesize'

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm'
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

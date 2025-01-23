import type { Options } from 'tsup'

export default <Options>{
  cjsInterop: true,
  clean: true,
  dts: true,
  entry: [
    'src/*.ts',
  ],
  format: ['cjs', 'esm'],
  onSuccess: 'npm run build:fix',
  splitting: true,
}

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: true,
  sourcemap: true,
  outDir: 'dist',
  target: 'es2020',
  bundle: true,
  loader: {
    '.ts': 'ts',
  },
});
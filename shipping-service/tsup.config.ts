import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ['cjs'],
  external: ['express', 'morgan', 'pg'],

  tsconfig: './tsconfig.json',

  dts: {
    compilerOptions: {
      composite: false,
    },
  },
});

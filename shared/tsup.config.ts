import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // Asegúrate de que tus carpetas estén en 'src/'
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});

import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs'

export default defineConfig(() => {
  return {
    // https://github.com/vitejs/vite/issues/1973#issuecomment-787571499
    define: {
      'process.env': {},
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
        },
    },
    build: {
      outDir: 'build',
    },
    plugins: [react(), commonjs()],
  };
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        nodePolyfills({
            include: ['buffer', 'process', 'util'],
            globals: {
                Buffer: true,
                global: true,
                process: true
            },
        }),
    ],
    define: {
        global: 'globalThis',
    },
    build: {
        target: 'esnext',
        sourcemap: true,
    },
    server: {
        historyApiFallback: true,
    },
});
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        react(),
    ],
    server: {
        watch: {
            usePolling: true, // Enable polling to detect file changes
        },
        host: '0.0.0.0', // Allow access from outside the container
        port: 5173, // Specify Vite dev server port
        strictPort: true, // Ensure the port is used exclusively
        hmr: {
            host: 'localhost', // Hot Module Replacement (HMR) config
        },
    },
});

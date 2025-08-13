// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        exclude: ['lucide-react'], // já estava antes
    },
    build: {
        target: 'es2020',
        sourcemap: false, // true se quiser map de depuração
        chunkSizeWarningLimit: 1000, // aumenta limite do aviso
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
                    lucide: ['lucide-react'],
                },
            },
        },
    },
});

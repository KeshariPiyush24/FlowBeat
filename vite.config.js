import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/FlowBeat/',
    server: {
        port: 5173,
        open: true
    },
    build: {
        outDir: 'dist',
        minify: 'esbuild',
        sourcemap: true
    }
}) 
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
            manifest: {
                name: 'FlowBeat - Hustle Harder, Lofi Louder!',
                short_name: 'FlowBeat',
                description: 'FlowBeat is a lofi radio that plays hip hop beats. It\'s the perfect background music for studying, working, or just relaxing.',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'icons/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
    base: '/FlowBeat/',
    server: {
        port: 5173,
        open: true
    },
    build: {
        outDir: 'dist',
        minify: 'esbuild',
        sourcemap: true
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                    :root {
                        color-scheme: dark;
                    }
                `
            }
        }
    }
}) 
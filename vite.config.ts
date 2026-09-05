// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    const environment = loadEnv(mode, process.cwd(), 'VITE_')
    const required = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID',
      'VITE_PUBLIC_MEDIA_BASE_URL',
      'VITE_PAYMENT_API_BASE_URL',
    ]
    const missing = required.filter((key) => !environment[key]?.trim())
    if (missing.length) {
      throw new Error(`Build interrompido: configure ${missing.join(', ')} no ambiente de build ou em .env.local. Consulte o README.`)
    }
    if (environment.VITE_FIREBASE_API_KEY.includes('xxxx')
      || environment.VITE_FIREBASE_API_KEY === 'demo-api-key'
      || ['seu-projeto', 'demo-alvorecermentorias'].includes(environment.VITE_FIREBASE_PROJECT_ID)) {
      throw new Error('Build interrompido: substitua a configuração Firebase de demonstração pela configuração do aplicativo web.')
    }
  }

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      target: 'es2020',
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      rolldownOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('/node_modules/react-router')) return 'router'
            if (id.includes('/node_modules/firebase/') || id.includes('/node_modules/@firebase/')) return 'firebase'
            if (id.includes('/node_modules/lucide-react/')) return 'lucide'
            if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/')) return 'react'
            return undefined
          },
        },
      },
    },
  }
})

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseadas no modo (development/production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Substitui process.env.API_KEY pelo valor real durante o build
      // Isso evita o erro "process is not defined" no navegador
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})
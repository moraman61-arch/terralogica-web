import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig(() => {
  const isGitHubPages = process.env.GITHUB_PAGES === 'true'

  return {
    base: isGitHubPages ? '/terralogica-web/' : '/',
    plugins: [
      react(),
      legacy({
        targets: ['defaults', 'safari >= 12', 'ios >= 12'],
      }),
    ],
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
    },
  }
})

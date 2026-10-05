import { defineConfig } from 'vite'

export default defineConfig({
  // Caminhos relativos: o build roda de qualquer pasta (exigência do upload no CrazyGames)
  base: './',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000,
  },
})

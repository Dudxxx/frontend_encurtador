// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // ou outro plugin que você use
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  }
})

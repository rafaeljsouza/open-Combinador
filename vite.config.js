import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' 

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('react-router')) return 'vendor-router'
          if (id.includes('lucide-react')) return 'vendor-icons'
          if (id.includes('react')) return 'vendor-react'

          return 'vendor-misc'
        },
      },
    },
  },
})

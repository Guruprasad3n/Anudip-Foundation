import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __API_URL__: JSON.stringify(
      process.env.NODE_ENV === 'production'
        ? 'https://anaudip-foundation.onrender.com/'
        : 'http://localhost:3000'

    )
  }
})

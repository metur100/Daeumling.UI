import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_PATH is set by the GitHub Pages workflow to "/<repo-name>/".
// Locally it falls back to "/".
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH ?? '/',
})

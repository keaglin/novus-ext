import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import MillionLint from "@million/lint"
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [crx({ manifest }), MillionLint.vite(), react(), tsconfigPaths()],
})

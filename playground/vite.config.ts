import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Unplugin from '../src/vite.js'

export default defineConfig({
  plugins: [
    Inspect(),
    Unplugin(),
  ],
})

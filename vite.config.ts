import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Silenciar warnings de deprecación de SASS (causados por Bootstrap)
        silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions', 'mixed-decls'],
      }
    }
  }
})

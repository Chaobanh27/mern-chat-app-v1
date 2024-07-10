import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  // Cho phép thằng Vite sử dụng được process.env, mặc định thì không mà sẽ phải dùng import.meta.env
  // https://github.com/vitejs/vite/issues/1973
  define: {
    'process.env': process.env
  },
  plugins: [
    react()
  ],
  // base: './'
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  }
})

import { defineConfig } from 'vite'
import dotenv from 'dotenv'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define:{
    'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
    'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
    'process.env.SERVER_URL': JSON.stringify(process.env.SERVER_URL)
  },
  // optimizeDeps: {
  //   exclude: ['simple-peer'],
  // }
})
dotenv.config()
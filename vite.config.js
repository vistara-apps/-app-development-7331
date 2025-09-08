import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          wagmi: ['wagmi', '@rainbow-me/rainbowkit', '@tanstack/react-query'],
          onchain: ['@coinbase/onchainkit', '@coinbase/wallet-sdk'],
          crypto: ['viem']
        }
      }
    }
  }
})

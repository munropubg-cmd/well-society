import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Use an assigned PORT when one is given (e.g. preview tooling), else 5173.
  server: { port: Number(process.env.PORT) || 5173 },
});

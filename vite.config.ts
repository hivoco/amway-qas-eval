import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/qas": {
        target: "https://tata-sampann-hi.thefirstimpression.ai",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 8827,
  },
});

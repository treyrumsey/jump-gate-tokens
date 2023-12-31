import { resolve } from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import Checker from "vite-plugin-checker";
import eslint from "vite-plugin-eslint";
import { VitePWA } from "vite-plugin-pwa";
import svgrPlugin from "vite-plugin-svgr";
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  define: {
    "process.env": {},
  },
  envDir: ".",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    minify: process.env.NODE_ENV === "production",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        background: resolve(__dirname, "background.html"),
      },
    },
  },
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgrPlugin(),
    eslint(),
    Checker({ typescript: true, overlay: true }),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Jump Gate",
        short_name: "Jump Gate",
        start_url: ".",
        display: "standalone",
        background_color: "#1A202C",
        icons: [
          {
            src: "favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
          {
            src: "logo192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "logo512.png",
            type: "image/png",
            sizes: "512x512",
          },
          {
            src: "android-chrome-192x192.png",
            type: "image/png",
            sizes: "192x192",
            purpose: "any maskable",
          },
          {
            src: "android-chrome-512x512.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "any maskable",
          },
        ],
        theme_color: "#1A202C",
      },
      workbox: {
        cleanupOutdatedCaches: false,
      },
    }),
  ],
});

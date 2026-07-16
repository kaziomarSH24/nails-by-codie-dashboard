// import path from "path";
// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [react(),tailwindcss(),],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   build: {
//     chunkSizeWarningLimit: 2000, // prevent warning for larger bundles
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           quill: ["react-quill"], // separate large library
//         },
//       },
//     },
//   },
// });


import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          quill: ["react-quill"],
        },
      },
    },
  },
});
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  build: {
    outDir: "lib/react-app",
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: false,
    minify: false,
    rollupOptions: {
      input: {
        main: "src/react-app/index.tsx",
      },
      output: {
        entryFileNames: "bundle.js",
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.names[0].endsWith(".css")) {
            return "index.css";
          }
          return "[name].[extname]";
        },
      },
    },
  },
  plugins: [
    typescript({
      tsconfig: "./tsconfig.buildReactApp.json",
    }),
    viteStaticCopy({
      targets: [
        {
          src: "src/react-app/index.html",
          dest: ".",
          rename: { stripBase: 2 },
        },
      ],
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});

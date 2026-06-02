import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    cssCodeSplit: false,
    emptyOutDir: true,
    minify: false,
    outDir: "lib/react-app",
    rollupOptions: {
      input: {
        main: "src/react-app/index.tsx",
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.names[0].endsWith(".css")) {
            return "index.css";
          }
          return "[name].[extname]";
        },
        chunkFileNames: "[name]-[hash].js",
        entryFileNames: "bundle.js",
      },
    },
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfig: "./tsconfig.buildReactApp.json",
    }),
    viteStaticCopy({
      targets: [
        {
          dest: ".",
          rename: { stripBase: 2 },
          src: "src/react-app/index.html",
        },
      ],
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});

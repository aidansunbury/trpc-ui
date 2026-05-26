import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  build: {
    outDir: "lib",
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    lib: {
      entry: "src/index.ts",
      name: "trpc-ui",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "js"}`,
    },
    rollupOptions: {
      external: [
        "@trpc/server",
        "zod",
        "valibot",
        "arktype",
        "superjson",
        "react",
        "react-dom",
        "node:fs",
        "node:url",
        "node:path",
      ],
    },
  },
  plugins: [
    typescript({
      tsconfig: "./tsconfig.buildPanel.json",
    }),
    dts({
      tsconfigPath: "./tsconfig.json",
      include: ["src/**/*.ts"],
      exclude: ["node_modules", "test", "src/react-app"],
      outDirs: "lib",
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});

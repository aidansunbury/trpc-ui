import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: "src/index.ts",
      fileName: (format) => `index.${format === "es" ? "mjs" : "js"}`,
      formats: ["es", "cjs"],
      name: "trpc-ui",
    },
    minify: false,
    outDir: "lib",
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
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfig: "./tsconfig.buildPanel.json",
    }),
    dts({
      exclude: ["node_modules", "test", "src/react-app"],
      include: ["src/**/*.ts"],
      outDirs: "lib",
      tsconfigPath: "./tsconfig.json",
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});

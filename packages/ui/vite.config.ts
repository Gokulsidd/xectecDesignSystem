import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src/**/*.ts", "src/**/*.tsx"],
      outDir: "dist",
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "XectecUI",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      // Externalize peer dependencies — do NOT bundle React
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
        // Preserve CSS in separate file
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) return "styles.css";
          return assetInfo.name ?? "asset";
        },
      },
    },
    sourcemap: true,
    // Do not minify — consumers' bundler will handle this
    minify: false,
  },
});

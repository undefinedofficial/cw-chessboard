import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import minimist from "minimist";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";

const { f } = minimist(process.argv.slice(2));

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({ rollupTypes: true, tsconfigPath: "./tsconfig.app.json" }),
  ],
  resolve: {
    alias: {
      "cw-chessboard": fileURLToPath(
        new URL("./src/chessboard", import.meta.url)
      ),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 8080,
  },
  build: {
    emptyOutDir: false,
    lib: {
      formats: f === "iife" ? ["iife"] : ["es", "umd"],
      entry: resolve(__dirname, "src/chessboard/index.ts"),
      name: "cw-chessboard",
      fileName: "index",
    },
    rollupOptions: {
      external: f === "iife" ? ["vue"] : ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});

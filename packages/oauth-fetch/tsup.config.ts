import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: [
      "src/index.ts",
    ],
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    minify: true,
    clean: true,
    treeshake: true,
    target: "esnext",
  },
]);

import { defineConfig } from "tsup";

export default defineConfig({
  // 后续会增加 entry
  entry: {
    index: "lib/cli.js",
  },
  format: ["esm", "cjs"],
  target: "es2020",
  sourcemap: true,
  splitting: false,
});

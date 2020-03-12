import dev from "rollup-plugin-dev";
import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const port = 5000;
const production = !process.env.ROLLUP_WATCH;

export default {
  input: "example/src/index.mjs",
  output: {
    sourcemap: true,
    format: "esm",
    file: "example/public/bundle.mjs",
    plugins: [production && terser()]
  },
  plugins: [
    dev({
      port,
      dirs: ["example/public"],
      spa: "example/public/index.html",
      basePath: "/modules/svelte-guard-history-router/example"
    }),
    resolve({ browser: true }),
    svelte()
  ]
};

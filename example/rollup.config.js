import acornClassFields from "acorn-class-fields";

import dev from "rollup-plugin-dev";
import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import pkg from "../package.json";

const port = pkg.config.port || 5000;

export default {
  input: "example/src/index.mjs",
  output: {
    sourcemap: true,
    format: "esm",
    file: `example/public/bundle.mjs`
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

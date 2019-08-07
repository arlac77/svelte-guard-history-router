import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import pkg from "./package.json";

export default {
  input: pkg.svelte,
  output: {
    format: "esm",
    file: "tmp.esm"
  },
  plugins: [
    svelte(),
    resolve()
  ]
};

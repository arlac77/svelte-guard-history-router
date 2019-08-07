import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import { terser } from "rollup-plugin-terser";
import autoPreprocess from "svelte-preprocess";
import postcssImport from "postcss-import";

import history from "connect-history-api-fallback";
import proxy from "http-proxy-middleware";
import express from "express";
import { create as browserSyncFactory } from "browser-sync";
import { config } from './package.json';

const production = !process.env.ROLLUP_WATCH;
const dist = "public";

export default {
  input: "src/main.mjs",
  output: {
    sourcemap: true,
    format: "esm",
    file: `${dist}/bundle.mjs`
  },
  plugins: [
    svelte({
      dev: !production,

      preprocess: autoPreprocess({
        transformers: {
          postcss: {
            plugins: [postcssImport]
          }
        }
      }),
      css: css => css.write(`${dist}/bundle.css`)
    }),

    resolve(),
    commonjs(),
    json({
      preferConst: true,
      compact: true
    }),
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};

if (!production) {
  function browsersync() {
    const browserSync = browserSyncFactory();
    const app = express();

    app.use(
      config.api,
      proxy({
        target: config.proxyTarget,
        changeOrigin: true,
        logLevel: "debug"
      })
    );

    browserSync.init({
      server: dist,
      watch: true,
      middleware: [app, history()]
    });
  }

  setTimeout(() => {
    browsersync();
  }, 500);
}

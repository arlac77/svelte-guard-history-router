import { svelte } from "@sveltejs/vite-plugin-svelte";
//import { extractFromPackage } from "npm-pkgbuild/src/module.mjs";
import { defineConfig } from "vite";

export default defineConfig(async ({ command, mode }) => {
  const { extractFromPackage } = await import(
    new URL("node_modules/npm-pkgbuild/src/module.mjs", import.meta.url)
  );
  const res = extractFromPackage({
    dir: new URL("./", import.meta.url).pathname
  });
  const first = await res.next();
  const pkg = first.value;
  const properties = pkg.properties;
  const base = properties["http.path"] + "/";
  const production = mode === "production";

  process.env["VITE_NAME"] = properties.name;
  process.env["VITE_DESCRIPTION"] = properties.description;
  process.env["VITE_VERSION"] = properties.version;

  return {
    base,
    root: "tests/app/src",
    worker: { format: "es" },
    plugins: [
      svelte({
        compilerOptions: {
          dev: !production
        }
      })
    ],
    optimizeDeps: {
      exclude: [
        ...Object.keys(pkg.dependencies).filter(d => d.startsWith("svelte"))
      ]
    },
    server: { host: true },
    build: {
      outDir: "../../../build",
      target: "esnext",
      emptyOutDir: true,
      minify: production,
      sourcemap: true
    }
  };
});

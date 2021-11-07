/* eslint-disable @typescript-eslint/no-var-requires */
const { build } = require("esbuild")

const production = process.env.NODE_ENV === "production"

build({
  entryPoints: ["src/livereload/client.ts"],
  outfile: "src/livereload/client.js.text",
  platform: "browser",
  target: "es2020",
  format: "iife",
  bundle: true,
  minify: production,
})
  .then(() => {
    build({
      entryPoints: ["src/index.ts"],
      outdir: production ? "dist" : "test/src",
      platform: "node",
      target: "node12",
      format: "cjs",
      bundle: true,
      minify: production,
      loader: {
        ".js.text": "text",
      },
      external: ["js-yaml", "glob", "fs-extra", "postcss"],
    }).catch(() => process.exit(1))
  })
  .catch(() => process.exit(1))

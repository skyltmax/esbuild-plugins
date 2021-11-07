// adapted from https://github.com/deanc/esbuild-plugin-postcss/blob/af3e9a27ec5ce006f9e780f4d7b04274458c38c4/index.js
import postcss, { AcceptedPlugin } from "postcss"
import glob from "glob"
import path from "path"
import fs from "fs-extra"
import type { Plugin } from "esbuild"

export interface Options {
  plugins?: AcceptedPlugin[]
}

const postCssPlugin = ({ plugins }: Options = {}): Plugin => ({
  name: "postcss",
  setup: function (build) {
    build.onResolve({ filter: /.\.(css)$/, namespace: "file" }, args => {
      if (args.resolveDir === "") return

      const filePath = path.isAbsolute(args.path) ? args.path : path.join(args.resolveDir, args.path)
      const watchFiles = glob.sync(`${args.resolveDir}/**/*.css`)

      return {
        path: filePath,
        namespace: "postcss",
        watchFiles,
      }
    })

    build.onLoad({ filter: /.*/, namespace: "postcss" }, async args => {
      const css = await fs.readFile(args.path)
      const result = await postcss(plugins).process(css, { from: args.path })

      return {
        contents: result.css,
        loader: "css",
      }
    })
  },
})

export default postCssPlugin

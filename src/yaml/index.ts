// adapted from https://github.com/martonlederer/esbuild-plugin-yaml/blob/d8d14d18c999f6507e906a7015ace0c991b507b4/src/index.ts
import fs from "fs-extra"
import path from "path"
import yaml from "js-yaml"
import type { Plugin } from "esbuild"

export interface Options {
  loadOptions?: yaml.LoadOptions
}

const yamlPlugin = ({ loadOptions }: Options = {}): Plugin => ({
  name: "yaml",
  setup(build) {
    // resolve .yaml and .yml files
    build.onResolve({ filter: /\.(yml|yaml)$/ }, args => {
      if (args.resolveDir === "") return

      const filePath = path.isAbsolute(args.path) ? args.path : path.join(args.resolveDir, args.path)

      return {
        path: filePath,
        namespace: "yaml",
        watchFiles: [filePath],
      }
    })

    // load files within "yaml" namespace
    build.onLoad({ filter: /.*/, namespace: "yaml" }, async args => {
      const yamlContent = await fs.readFile(args.path)
      const parsed = yaml.load(new TextDecoder().decode(yamlContent), loadOptions)

      return {
        contents: JSON.stringify(parsed),
        loader: "json",
      }
    })
  },
})

export default yamlPlugin

/* eslint-disable @typescript-eslint/no-var-requires */
const { build } = require("esbuild")
const fs = require("fs")
const http = require("http")
const { yamlPlugin, postCssPlugin, liveReloadPlugin, tslintPlugin } = require("./src/index")

const watch = process.argv.slice(2).includes("--watch")

if (watch) {
  http
    .createServer((req, res) => {
      const path = req.url === "/" ? "/index.html" : req.url

      fs.readFile(__dirname + path, function (err, data) {
        if (err) {
          res.writeHead(404)
          res.end(JSON.stringify(err))
          return
        }
        res.writeHead(200, { "Content-Type": path.endsWith(".js") ? "application/javascript" : "text/html" })
        res.end(data)
      })
    })
    .listen(3000)
}

build({
  entryPoints: ["test/src/testfile.js"],
  outdir: "test/out",
  platform: "browser",
  target: "es2020",
  format: "esm",
  bundle: true,
  minify: false,
  watch,
  plugins: [yamlPlugin(), postCssPlugin(), liveReloadPlugin(), tslintPlugin()],
}).catch(() => process.exit(1))

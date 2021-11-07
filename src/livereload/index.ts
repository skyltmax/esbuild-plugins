import type { Plugin } from "esbuild"
import { createServer, ServerResponse } from "http"
import type { BuildMessage } from "./client"
import client from "./client.js.text"

export interface Options {
  port?: number
}

const liveReloadPlugin = ({ port }: Options = {}): Plugin => ({
  name: "liveReload",
  setup(build) {
    const options = build.initialOptions
    const watchMode = options.watch

    const clients: ServerResponse[] = []
    port = port || 3035

    if (watchMode) {
      const portJS = `;window.__esbuildLiveReloadPort = ${port};`
      const banner = {
        js: portJS + client,
      }

      createServer((req, res) => {
        if (req.url === "/esbuild") {
          clients.push(
            res.writeHead(200, {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              Connection: "keep-alive",
            })
          )

          return
        }
      }).listen(port)

      console.info(`LiveReload server listening on :${port}`)

      options.banner = banner
      options.watch = {
        onRebuild(errors, _) {
          const error = errors?.errors[0]
          const data: BuildMessage = { success: !error, errors: errors?.errors }

          clients.forEach(res => res.write(`data: ${JSON.stringify(data)}\n\n`))

          if (!error) {
            clients.length = 0
          }
        },
      }
    }
  },
})

export default liveReloadPlugin

import type { Message } from "esbuild"

const port = window.__esbuildLiveReloadPort || 3035

export interface BuildMessage {
  success?: boolean
  errors?: Message[]
}

const source = new EventSource(`http://localhost:${port}/esbuild`)
source.onmessage = (e: MessageEvent<string>) => {
  const message = JSON.parse(e.data) as BuildMessage

  if (message.success) {
    console.log("esbuild rebuilt, reloading")
    location.reload()
  } else {
    console.error("esbuild build failed:")

    if (message.errors) {
      for (const err of message.errors) {
        console.error(err.text)
      }
    }
  }
}

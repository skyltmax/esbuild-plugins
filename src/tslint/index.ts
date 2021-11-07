/* eslint-disable no-empty */
// adapted from https://github.com/rsms/estrella/blob/aca6a68104cdc35c9112d3a559840e38fdc1a12a/src/tslint.js
import type { BuildOptions, Plugin } from "esbuild"
import { statSync } from "fs"
import * as path from "path"
import { spawn } from "child_process"
import { screen, stdoutStyle } from "./screen"

function tsConfigFileSearchDir(options: BuildOptions, cwd?: string): string {
  let dir = cwd || process.cwd()

  if (options.entryPoints && Object.keys(options.entryPoints).length > 0) {
    let firstEntryPoint = ""

    if (Array.isArray(options.entryPoints)) {
      firstEntryPoint = options.entryPoints[0]
    } else {
      for (const outfile of Object.keys(options.entryPoints)) {
        firstEntryPoint = options.entryPoints[outfile]
        break
      }
    }

    dir = path.resolve(dir, path.dirname(firstEntryPoint))
  }

  return dir
}

function* searchTSConfigFile(dir: string, maxParentDir?: string): Generator<string> {
  // start at dir and search for dir + tsconfig.json,
  // moving to the parent dir until found or until parent dir is the root dir.
  // If maxParentDir is set, then stop when reaching directory maxParentDir.
  dir = path.resolve(dir)
  const root = path.parse(dir).root

  maxParentDir = maxParentDir ? path.resolve(maxParentDir) : root
  while (true) {
    yield path.join(dir, "tsconfig.json")

    if (dir == maxParentDir) {
      // stop. this was the last dir we were asked to search
      break
    }
    dir = path.dirname(dir)

    if (dir == root) {
      // don't search "/"
      break
    }
  }
}

function findTSConfigFile(dir: string, maxParentDir?: string): string | null {
  for (const path of searchTSConfigFile(dir, maxParentDir)) {
    try {
      const st = statSync(path)
      if (st.isFile()) {
        return path
      }
    } catch (_) {}
  }
  return null
}

function findTSC(cwd?: string): string {
  let npmPath = ""
  const tmpcwd = process.cwd()
  const exe = "tsc"

  if (cwd) {
    process.chdir(cwd)
  }

  try {
    npmPath = require.resolve("typescript")
  } catch (_) {}

  if (cwd) {
    process.chdir(tmpcwd)
  }

  if (npmPath) {
    const find = path.sep + "node_modules" + path.sep
    const i = npmPath.indexOf(find)
    if (i != -1) {
      return path.join(npmPath.substr(0, i + find.length - path.sep.length), ".bin", exe)
    }
  }

  // not found in node_modules
  return exe
}

function stringy(value: any): value is string {
  return !!value
}

export interface Options {
  cwd?: string
}

const tslintPlugin = ({ cwd }: Options = {}): Plugin => ({
  name: "tslint",
  setup(build) {
    const options = build.initialOptions
    const entrypointDir = tsConfigFileSearchDir(options, cwd)
    const tsconfigFile = findTSConfigFile(entrypointDir, cwd)
    const tscprog = findTSC(cwd)

    if (!tscprog) {
      throw new Error("Typescript compiler not found")
    }

    const args = ["--noEmit", "--pretty", tsconfigFile && "--project", tsconfigFile].filter(stringy)

    const buffer: string[] = []
    let promise: Promise<void> | undefined
    let lastCode: number | null = null
    let killCurrent: () => void | undefined
    let tscWaitTimer: NodeJS.Timeout | undefined

    build.onStart(() => {
      if (killCurrent) killCurrent()

      promise = new Promise((resolve, _reject) => {
        const p = spawn(tscprog, args, {
          stdio: ["inherit", "pipe", "inherit"],
          cwd,
        })

        buffer.length = 0

        p.stdout.setEncoding("utf8")
        p.stdout.on("data", function (data) {
          buffer.push(data)
        })

        const onProcessExitHandler = () => {
          try {
            p.kill()
          } catch (_) {}
        }

        process.on("exit", onProcessExitHandler)

        const onClose = (code: number | null) => {
          lastCode = code
          process.removeListener("exit", onProcessExitHandler)

          console.log(screen.banner("—"))
          console.log(code === 0 ? stdoutStyle.green("TS: OK") : stdoutStyle.red(`TS: code ${code}`))
          console.log(screen.banner("—"))
          console.log(buffer.join(""))
          resolve()
        }

        p.on("close", onClose)

        killCurrent = () => {
          process.off("exit", onProcessExitHandler)
          p.off("close", onClose)
          p.kill()
        }
      })
    })

    build.onEnd(result => {
      promise?.then(() => {
        if (tscWaitTimer) clearTimeout(tscWaitTimer)

        if (lastCode !== 0) {
          result.errors.push({ pluginName: "tslint", text: buffer.join(""), location: null, notes: [], detail: null })
        }
      })

      if (!options.watch) tscWaitTimer = setTimeout(() => console.log("Waiting for TypeScript... (^C to skip)"), 1000)
      return promise
    })
  },
})

export default tslintPlugin

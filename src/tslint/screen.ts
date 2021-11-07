const stdoutIsTTY = !!process.stdout.isTTY
const stderrIsTTY = !!process.stderr.isTTY

export const screen = {
  width: 60,
  height: 20,
  clear() {
    null
  },
  banner(ch?: string) {
    if (!ch) {
      ch = "-"
    }

    return ch.repeat(Math.floor((screen.width - 1) / ch.length))
  },
}

if (stdoutIsTTY || stderrIsTTY) {
  const ws = (stdoutIsTTY && process.stdout) || process.stderr
  const updateScreenSize = () => {
    screen.width = ws.columns
    screen.height = ws.rows
  }

  ws.on("resize", updateScreenSize)
  updateScreenSize()
  screen.clear = () => {
    // Note: \ec is reported to not work on the KDE console Konsole.
    // TODO: detect KDE Konsole and use \e[2J instead
    // Clear display: "\x1bc"
    // Clear Screen: \x1b[{n}J clears the screen
    //   n=0 clears from cursor until end of screen
    //   n=1 clears from cursor to beginning of screen
    //   n=2 clears entire screen
    ws.write("\x1bc")
  }
  // Note: we can clear past rows relatively using these two functions:
  // ws.moveCursor(0, -4)
  // ws.clearScreenDown()
}

function numColors(w: NodeJS.WriteStream, hint?: boolean) {
  let ncolors = 0
  if (hint === true) {
    // use colors regardless of TTY or not
    const t = process.env.TERM || ""
    ncolors =
      t && ["xterm", "screen", "vt100"].some(s => t.indexOf(s) != -1) ? (t.indexOf("256color") != -1 ? 8 : 4) : 2
  } else if (hint !== false && w.isTTY) {
    // unless hint is explicitly false, use colors if stdout is a TTY
    ncolors = w.getColorDepth()
  }
  return ncolors
}

export function termStyle(w: NodeJS.WriteStream, hint?: boolean) {
  return createTermStyle(numColors(w, hint), hint)
}

export function createTermStyle(ncolors: number, hint?: boolean) {
  const CODE = (s: string) => `\x1b[${s}m`

  const effect =
    ncolors > 0 || hint
      ? (open: string, close: string) => {
          const a = CODE(open),
            b = CODE(close)
          return (s: string) => a + s + b
        }
      : (_: any) => (s: string) => s

  const color: (_open16: string, _open256: string, _close: string) => (s: string) => string =
    // 256 colors support
    ncolors >= 8
      ? (_open16, open256, close) => {
          // const open = CODE(code), close = CODE('2' + code)
          const a = "\x1b[" + open256 + "m",
            b = "\x1b[" + close + "m"
          return s => a + s + b
        }
      : // 16 colors support
      ncolors > 0
      ? (open16, _open256, close) => {
          const a = "\x1b[" + open16 + "m",
            b = "\x1b[" + close + "m"
          return s => a + s + b
        }
      : // no colors
        (_open16, _open256, _close) => s => s

  return {
    _hint: hint,
    ncolors,

    reset: hint || ncolors > 0 ? "e[0m" : "",

    bold: effect("1", "22"),
    italic: effect("3", "23"),
    underline: effect("4", "24"),
    inverse: effect("7", "27"),

    // name           16c    256c                 close
    white: color("37", "38;2;255;255;255", "39"),
    grey: color("90", "38;5;244", "39"),
    black: color("30", "38;5;16", "39"),
    blue: color("34", "38;5;75", "39"),
    cyan: color("36", "38;5;87", "39"),
    green: color("32", "38;5;84", "39"),
    magenta: color("35", "38;5;213", "39"),
    purple: color("35", "38;5;141", "39"),
    pink: color("35", "38;5;211", "39"),
    red: color("31", "38;2;255;110;80", "39"),
    yellow: color("33", "38;5;227", "39"),
    lightyellow: color("93", "38;5;229", "39"),
    orange: color("33", "38;5;215", "39"),
  }
}

export const stdoutStyle = termStyle(process.stdout)
export const stderrStyle = termStyle(process.stderr)

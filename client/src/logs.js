// Captures console errors / crashes into a ring buffer, shown by the
// ErrorBoundary or the boot watchdog — no more silent white screens.
const logs = []

export function installLogCapture() {
  const fmt = (a) => {
    try {
      if (typeof a === 'string') return a
      return JSON.stringify(a)?.slice(0, 300) ?? String(a)
    } catch {
      return String(a)
    }
  }
  const push = (kind, parts) => {
    logs.push(`[${kind}] ${parts.map(fmt).join(' ')}`.slice(0, 500))
    if (logs.length > 25) logs.shift()
  }
  const origError = console.error.bind(console)
  console.error = (...args) => {
    push('error', args)
    origError(...args)
  }
  window.addEventListener('error', (e) => push('crash', [`${e.message} @ ${e.filename || '?'}:${e.lineno}`]))
  window.addEventListener('unhandledrejection', (e) => push('promise', [String(e.reason?.message || e.reason)]))
  window.__vgLogs = () => logs.join('\n')
}

export function getLogs() {
  try {
    return window.__vgLogs ? window.__vgLogs() : ''
  } catch {
    return ''
  }
}

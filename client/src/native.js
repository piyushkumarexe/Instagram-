// Platform helpers (kept separate from fb.js so scripts can import safely)
export function isNative() {
  return typeof window !== 'undefined' && !!window.Capacitor?.isNativePlatform?.()
}
